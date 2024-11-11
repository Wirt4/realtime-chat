import myGetServerSession from "@/lib/myGetServerSession";
import {z} from "zod";
import {removeDbEntry} from "@/lib/dbWrapper";
import QueryBuilder from "@/lib/queryBuilder";
import {getPusherServer} from "@/lib/pusher";

export async function POST(req: Request) {
    try {
        let body: object
        let senderId: string

        try {
            body = await req.json()
            const { id: idToDeny } = z.object({ id: z.string() }).parse(body)
            senderId = idToDeny
        }catch{
            return respond('Invalid Request Payload', 422);
        }

        const session = await myGetServerSession()

        if (!session) {
            return respond('Unauthorized', 401)
        }

        const userId = session.user.id

        try{
            const client = getPusherServer()
            await client.trigger(`user__${userId}__friends`, QueryBuilder.deny_friend, senderId)
        }catch{
            return respond('Pusher Error', 424)
        }

        await removeDbEntry(QueryBuilder.incomingFriendRequests(userId), senderId)
    } catch {
        return respond('Redis Error', 424)
    }

    return respond()
}

function respond(message:string='OK', status: number = 200): Response {
    return new Response(message, { status })
}
