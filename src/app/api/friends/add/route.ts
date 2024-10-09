import {addFriendValidator} from "@/lib/validations/add-friend";

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

    constructor() {
        this.status = 400
        this.message = 'This person does not exist.'
    }

    validateEmail(email:{email:string}){
        return addFriendValidator.parse(email)
    }
    setReturn(message: string, status: number = 400){
        this.status = status
        this.message = message
    }
    async triggerPusher():Promise<void> {}
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
        const areAlreadyFriends = await this.areAlreadyFriends()
        return userExists && session && !(isSameUser  || isAlreadyAdded|| areAlreadyFriends)
    }
    async userExists():Promise<boolean>{
        //stub
        return false
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
        return true
    }
}