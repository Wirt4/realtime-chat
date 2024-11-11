import myGetServerSession from "@/lib/myGetServerSession";
import {z} from "zod";
import {removeDbEntry} from "@/lib/dbWrapper";

export async function POST(req: Request) {
    try {
        let body: object
        try {
             body = await req.json()
        }catch{
            return new Response('Invalid Request Payload', { status: 422 })
        }
        const session = await myGetServerSession()

        if (!session) {
            return new Response('Unauthorized', { status: 401 })
        }

        const { id: idToDeny } = z.object({ id: z.string() }).parse(body)

        await removeDbEntry(`user:${session.user.id}:incoming_friend_requests`, idToDeny)

        return new Response('OK')
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response('Invalid Request Payload', { status: 422 })
        }

        return new Response('Redis Error', { status: 424 })
    }
}
