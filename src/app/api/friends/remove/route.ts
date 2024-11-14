import {z} from "zod";
import {getServerSession} from "next-auth";
import fetchRedis from "@/helpers/redis";

export async function POST(request: Request) {
    let targetId: string
    try{
       const {idToRemove} =  z.object({idToRemove: z.string()}).parse(await request.json());
       targetId = idToRemove;
    }catch{
        return respond("Invalid Input", 422)
    }

    const session = await getServerSession()

    if (!session?.user?.id) {
        return respond('Unauthorized', 401)
    }

    await fetchRedis('sismember', `user:${session.user.id}:friends`, targetId)
    return respond('Not Friends', 400);
}

function respond(message: string, status: number) {
    return new Response(message, {status});
}
