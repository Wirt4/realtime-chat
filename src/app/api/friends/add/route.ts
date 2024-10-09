import {addFriendValidator} from "@/lib/validations/add-friend";

export async function  POST(req: Request):Promise<Response> {
    try{
        addFriendValidator.parse(req.body)
        return new Response('shiny happy people')
    }catch(err){
        return new Response("Invalid request payload", {status: 422})
    }
}