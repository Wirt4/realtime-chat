import {addFriendValidator} from "@/lib/validations/add-friend";
import {Utils} from "@/lib/utils";
import myGetServerSession from "@/lib/myGetServerSession";
import {pusherServer} from "@/lib/pusher";
import fetchRedis from "@/app/helpers/redis";
import {db} from "@/lib/db";

interface errorProps{
    message: string,
    opts:{
        status: number
    }
}

export async function  POST(req: Request):Promise<Response> {

    const routeHandler = new PostFriendsRouteHandler()
    const body = await req.json()
    const validRequest = await routeHandler.isValidRequest(body)

    if (!validRequest) {
        const {message, opts} = routeHandler.errorResponse()
        return new Response(message, opts)
    }

    await routeHandler.triggerPusher()
    await routeHandler.addToDB()
    return new Response('OK')

}

export class PostFriendsRouteHandler {
    private status: number
    private message: string
    public idToAdd: string
    public senderId: string
    public senderEmail: string

    constructor() {
        this.status = 400
        this.message = 'This person does not exist.'
        this.idToAdd = this.senderEmail = this.senderId= ''
    }

    validateEmail(email:{email:string}){
        return addFriendValidator.parse(email)
    }

    setAndReturn(message: string, status: number = 400): boolean{
        this.status = status
        this.message = message
        return false
    }

    async triggerPusher():Promise<void> {
        const key = Utils.toPusherKey( `user:${this.idToAdd}:incoming_friend_requests`)

        pusherServer.trigger(
            key,
            'incoming_friend_requests',
            {senderEmail: this.senderEmail, senderId: this.senderId}
        )
    }

    async isValidRequest(requestBody:any):Promise<boolean>{

        try{
            this.validateEmail(requestBody.email)
        }catch(error){
            return this.setAndReturn('Invalid request payload', 422)
       }

       const userExists = await this.userExists()
        if (!userExists){
            return this.setAndReturn('This person does not exist.')
        }

        const session = await this.getSession()
        if (!session){
            return this.setAndReturn('unauthorized', 401)
        }

        const isSameUser = this.isSameUser()
        if (isSameUser){
            return this.setAndReturn('You cannot add yourself as a friend')
        }

        const isAlreadyAdded = await this.isAlreadyAdded()
        if (isAlreadyAdded){
            return this.setAndReturn('You\'ve already added this user')
        }

        const areAlreadyFriends = await this.areAlreadyFriends()
        if (areAlreadyFriends){
            return this.setAndReturn("You're already friends with this user")
        }

        return true
    }

    async userExists():Promise<boolean>{
        this.idToAdd = await fetchRedis()
        return Boolean(this.idToAdd)
    }

    async redisSismember(userId: string, list: 'incoming_friend_requests' | 'friends', queryId:string):Promise<boolean>{
        const result = await fetchRedis("sismember",  `user:${userId}:${list}`,queryId) as 0 | 1
        return Boolean(result)
    }

    async isAlreadyAdded():Promise<boolean>{
        return this.redisSismember(this.idToAdd, 'incoming_friend_requests', this.senderId)
    }

    async areAlreadyFriends():Promise<boolean>{
        return this.redisSismember(this.senderId, 'friends',this.idToAdd)
    }

    async addToDB():Promise<void>{
        await db.sadd(`user:${this.idToAdd}:incoming_friend_requests`,this.senderId )
    }

    isSameUser():boolean{
        return this.senderId === this.idToAdd
    }

    errorResponse(): errorProps{
        return  {
            message:this.message,
            opts: { status: this.status }
        }
    }

    async getSession(){
        const session = await myGetServerSession()
        this.senderId = session?.user.id as string
        this.senderEmail= session?.user.email as string
        return session
    }
}
