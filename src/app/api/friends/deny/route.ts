import myGetServerSession from "@/lib/myGetServerSession";
import {z} from "zod";
import {removeDbEntry} from "@/lib/dbWrapper";
import QueryBuilder from "@/lib/queryBuilder";
import {getPusherClient, getPusherServer} from "@/lib/pusher";

export async function POST(req: Request) {
    try {
        const session = await myGetServerSession()

        if (!session) {
            return respond('Unauthorized', 401)
        }

        let body: object
        let id: string

        try {
             body = await req.json()
            const { id: idToDeny } = z.object({ id: z.string() }).parse(body)
            id = idToDeny
        }catch{
            return respond('Invalid Request Payload', 422);
        }
        try{
            const client = getPusherServer()
            await client.trigger("user__1966__friends", 'bar', 'spam')
        }catch{
            return respond('Pusher Error', 424)
        }
        await removeDbEntry(QueryBuilder.incomingFriendRequests(session.user.id), id)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return respond('Invalid Request Payload', 422)
        }
        return respond('Redis Error', 424)
    }

    return respond()
}

function respond(message:string='OK', status: number = 200): Response {
    return new Response(message, { status })
}
