import {z} from "zod";
import {getServerSession} from "next-auth";
import fetchRedis from "@/helpers/redis";
import {db} from "@/lib/db";
import axios from "axios";

export async function POST(request: Request) {
    let targetId: string
    try{
        targetId = z.object({idToRemove: z.string()}).parse(await request.json()).idToRemove;
    }catch{
        return respond("Invalid Input", 422)
    }

    const session = await getServerSession()

    if (!session?.user?.id) {
        return respond('Unauthorized', 401)
    }

    const sessionId =session.user.id

    if (await fetchRedis('sismember', `user:${sessionId}:friends`, targetId)){
        await Promise.all(
            [remove(sessionId,targetId), remove(targetId, sessionId)]
        );
    }

    const ids = [sessionId, targetId];
    await axios.post('/message/remove/all', {chatId: ids.sort().join('--')})
    return respond('Not Friends', 400);
}

function respond(message: string, status: number) {
    return new Response(message, {status});
}

async function remove(queryId: string, targetId: string){
   return db.srem(`user:${queryId}:friends`, targetId)
}
