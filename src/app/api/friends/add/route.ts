import {addFriendValidator} from "@/lib/validations/add-friend";
import {ZodError} from "zod";
import {Helpers} from "@/lib/helpers";

export async function  POST(req: Request):Promise<Response> {
    try{
        const body = await req.json()
        addFriendValidator.parse(body)
        const foo = await Helpers.fetchRedis()
        if (!foo){
            return new Response("This User does not exist", {status: 400})
        }
        return new Response('shiny happy people')
    }catch(err){
        if (err instanceof ZodError){
            return new Response("Invalid request payload", {status: 422})
        }
        return new Response("Invalid request", {status: 400})
    }
}