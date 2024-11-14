import {z} from "zod";
import {getServerSession} from "next-auth";
import fetchRedis from "@/helpers/redis";
import {db} from "@/lib/db";

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

    await fetchRedis('sismember', `user:${session.user.id}:friends`, targetId)
    await db.srem("user:kirk:friends", "spock");
    await db.srem("user:spock:friends", "kirk");
    return respond('Not Friends', 400);
}

function respond(message: string, status: number) {
    return new Response(message, {status});
}
