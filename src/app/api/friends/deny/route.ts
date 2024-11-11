import myGetServerSession from "@/lib/myGetServerSession";
import {z} from "zod";

export async function POST(req:Request) {
    const session = await myGetServerSession()
    
    if (!session) {
        return returnResponse('Unauthorized', 401)
    }

    try{
        const body = await req.json()
        z.object({ id: z.string() }).parse(body)
    }catch{
        return returnResponse('Invalid Request payload', 421)
    }

    return returnResponse('Redis Error', 424)
}

function returnResponse(message: string, status: number): Response {
    return new Response(message, {status})
}
