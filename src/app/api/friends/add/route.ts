import {addFriendValidator} from "@/lib/validations/add-friend";
import {ZodError} from "zod";

export async function  POST(req: Request):Promise<Response> {
    try{
        addFriendValidator.parse(req.body)
        return new Response('shiny happy people')
    }catch(err){
        if (err instanceof ZodError){
            return new Response("Invalid request payload", {status: 422})
        }
        return new Response("Invalid request", {status: 400})
    }
}