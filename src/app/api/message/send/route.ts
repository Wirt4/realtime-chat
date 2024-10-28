import myGetServerSession from "@/lib/myGetServerSession";
import Participants from "@/lib/chatParticipants.js";
import fetchRedis from "@/helpers/redis";
import QueryBuilder from "@/lib/queryBuilder";
import {db} from "@/lib/db";
import {nanoid} from "nanoid";
import {Message, messageSchema} from "@/lib/validations/messages";

export async function POST(request: Request) {
    const session = await myGetServerSession()
    const {chatId, text}: {chatId: string, text: string} = await request.json()
    const senderId = session?.user?.id as string
    const chatParticipants = new Participants(chatId, senderId)
    const query = QueryBuilder.friends(session?.user.id as string )

    const friendList = await fetchRedis('smembers', query) as string[]

    if (!(chatParticipants.includesSession() && friendList.includes(chatParticipants.partnerId()))){
        return new Response('Unauthorized', {status: 401})
    }
    const dbDuery = QueryBuilder.messages(chatId)
    const timestamp = Date.now()
    const msg : Message= {id: nanoid(), senderId, text, timestamp}
    db.zadd(dbDuery, {score: timestamp, member: JSON.stringify(messageSchema.parse(msg))})
}
