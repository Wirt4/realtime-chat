import {z} from "zod";
import {getServerSession} from "next-auth";
import fetchRedis from "@/helpers/redis";
import {db} from "@/lib/db";
import {authOptions} from "@/lib/auth";

export async function POST(request: Request) {
    let targetId: string

    try{
        targetId = z.object({idToRemove: z.string()}).parse(await request.json()).idToRemove;
    }catch{
        return respond("Invalid Input", 422)
    }

    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        return respond('Unauthorized', 401)
    }

    const sessionId = session.user.id
    const areFriends =  await fetchRedis('sismember', `user:${sessionId}:friends`, targetId)
    if (!areFriends) {
        return respond('Not Friends', 400);
    }

    try {
        await Promise.all([
            remove(sessionId,targetId),
            remove(targetId, sessionId),
        ]);
    }catch{
        return respond('Problem with redis', 500);
    }

    return new Response('OK')
}

function respond(message: string, status: number) {
    return new Response(message, {status});
}

async function remove(queryId: string, targetId: string){
   return db.srem(`user:${queryId}:friends`, targetId)
}
