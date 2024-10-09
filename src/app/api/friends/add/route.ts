import {addFriendValidator} from "@/lib/validations/add-friend";
import {Utils} from "@/lib/utils";
import myGetServerSession from "@/lib/myGetServerSession";
import {pusherServer} from "@/lib/pusher";
import fetchRedis from "@/app/helpers/redis";
import {Bold} from "lucide-react";

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
    setReturn(message: string, status: number = 400){
        this.status = status
        this.message = message
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
            this.setReturn('Invalid request payload', 422)
           return false
       }

       const userExists = await this.userExists()
        if (!userExists){
            this.setReturn('This person does not exist.')
            return false
        }

        const session = await this.getSession()
        if (!session){
            this.setReturn('unauthorized', 401)
            return false
        }

        const isSameUser = this.isSameUser()
        if (isSameUser){
            this.setReturn('You cannot add yourself as a friend')
            return false
        }

        const isAlreadyAdded = await this.isAlreadyAdded()
        if (isAlreadyAdded){
            this.setReturn('You\'ve already added this user')
            return false
        }

        const areAlreadyFriends = await this.areAlreadyFriends()
        if (areAlreadyFriends){
            this.setReturn("You're already friends with this user")
            return false
        }

        return true
    }
    async userExists():Promise<boolean>{
        this.idToAdd = await fetchRedis()
        return Boolean(this.idToAdd)
    }
    async isAlreadyAdded():Promise<boolean>{
        //stub
        return false
    }
    async areAlreadyFriends():Promise<boolean>{
        //stub
        return false
    }
    async addToDB():Promise<void>{}

    isSameUser():boolean{
        //stub
        return false
    }
    errorResponse(): errorProps{
        return  {
            message:this.message,
            opts: { status: this.status }
        }
    }
    async getSession(){
        const session = await myGetServerSession()
        return session
    }
}