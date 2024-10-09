import {addFriendValidator} from "@/lib/validations/add-friend";
import {is} from "@babel/types";

export async function  POST(req: Request):Promise<Response> {

    const routeHandler = new PostFriendsRouteHandler()
    const body = await req.json()
    const validRequest = await routeHandler.isValidRequest(body)

    if (!validRequest) {
        return routeHandler.errorResponse()
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
        return userExists && session && !isSameUser
    }
    async userExists():Promise<boolean>{
        //stub
        return false
    }
    async isAlreadyAdded(session:any):Promise<boolean>{
        //stub
        return false
    }
    async areAlreadyFriends(session:any):Promise<boolean>{
        //stub
        return false
    }
    async addToDB():Promise<void>{}
    isSameUser():boolean{
        //stub
        return false
    }
    errorResponse(): Response{
        return new Response(this.errorMessage, {status: this.statusCode})
    }
    async getSession(){
        return true
    }
}