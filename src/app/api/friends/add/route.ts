import {addFriendValidator} from "@/lib/validations/add-friend";
import {is} from "@babel/types";
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

    validateEmail(email:{email:string}){
        return addFriendValidator.parse(email)
    }
    async triggerPusher():Promise<void> {}
    async isValidRequest(requestBody:any):Promise<boolean>{
        try{
            this.validateEmail(requestBody.email)
        }catch(error){
           return false
       }

       const userExists = await this.userExists()
        const session = await this.getSession()
        const isSameUser = this.isSameUser()
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
    errorResponse(){
        return  {
            message:'Invalid request payload',
            opts: { status: 422 }
        }
    }
    async getSession(){
        return true
    }
}