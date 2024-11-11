import myGetServerSession from "@/lib/myGetServerSession";
import {z} from "zod";

export async function POST(req:Request) {
    const session = await myGetServerSession()
    if (!session) {
        return new Response('Unauthorized', { status: 401 })
    }

    try{
        const body = await req.json()
        z.object({ id: z.string() }).parse(body)
    }catch{
        return new Response('Invalid Request payload', { status: 421 })
    }

    return new Response('Redis Error', { status: 424 })
}
