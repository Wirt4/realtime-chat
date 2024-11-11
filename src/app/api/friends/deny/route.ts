import myGetServerSession from "@/lib/myGetServerSession";
import {z} from "zod";

export async function POST(req:Request) {
    const session = await myGetServerSession()
    
    if (!session) {
        return respondWith('Unauthorized', 401)
    }

    try{
        const body = await req.json()
        z.object({ id: z.string() }).parse(body)
    }catch{
        return respondWith('Invalid Request payload', 421)
    }

    return respondWith('Redis Error', 424)
}

function respondWith(message: string, status: number): Response {
    return new Response(message, {status})
}
