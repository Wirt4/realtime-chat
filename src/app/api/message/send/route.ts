import myGetServerSession from "@/lib/myGetServerSession";
import Participants from "@/lib/chatParticipants.js";
import fetchRedis from "@/helpers/redis";
import QueryBuilder from "@/lib/queryBuilder";
import {db} from "@/lib/db";
import {nanoid} from "nanoid";

export async function POST(request: Request) {
    const session = await myGetServerSession()
    const {chatId}: {chatId: string} = await request.json()

    const chatParticipants = new Participants(chatId, session?.user?.id as string )
    const query = QueryBuilder.friends(session?.user.id as string )

    const friendList = await fetchRedis('smembers', query) as string[]

    if (!(chatParticipants.includesSession() && friendList.includes(chatParticipants.partnerId()))){
        return new Response('Unauthorized', {status: 401})
    }
    const dbDuery = QueryBuilder.messages(chatId)
    const msg = {id: nanoid(), senderId:"anthony", text:"hello", timestamp:522497054}
    db.zadd(dbDuery, {score: Date.now(), member: JSON.stringify(msg)})
}
