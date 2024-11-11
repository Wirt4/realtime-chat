import myGetServerSession from "@/lib/myGetServerSession";
import {z} from "zod";

export async function POST(req:Request) {
    if ( await myGetServerSession()){
        try{
            const body = await req.json()
           z.object({ id: z.string() }).parse(body)
        }catch(error){
            return new Response('Invalid Request payload', { status: 421 })
        }
        return new Response('OK')
    }
    return new Response('Unauthorized', { status: 401 })
}
