import myGetServerSession from "@/lib/myGetServerSession";
import Participants from "@/lib/chatParticipants";
import fetchRedis from "@/helpers/redis";
import QueryBuilder from "@/lib/queryBuilder";
import {db} from "@/lib/db";
import {nanoid} from "nanoid";
import {Message, messageSchema} from "@/lib/validations/messages";

export async function POST(request: Request) {
    try {
        const senderId: string = await fetchSenderId()
        const {chatId, text}: { chatId: string, text: string } = await request.json()
        const chatParticipants: Participants = new Participants(chatId, senderId)
        const friendList: string[] = await fetchRedis('smembers', QueryBuilder.friends(senderId)) as string[]

        if (!(chatParticipants.includesSession() && friendList.includes(chatParticipants.partnerId()))) {
            return new Response('Unauthorized', {status: 401})
        }

        const timestamp: number = Date.now()
        const msg: Message = {id: nanoid(), senderId, text, timestamp}
        const parsedMessage: string = JSON.stringify(messageSchema.parse(msg))
        await db.zadd( QueryBuilder.messages(chatId), {score: timestamp, member: parsedMessage} )
        return new Response('OK')
    }catch(error){
        let message = 'Internal Server Error'

        if (error instanceof Error){
            message = error.message
        }

        return new Response(message, { status: 500, statusText: message })
    }
}

const fetchSenderId = async()=>{
    const session = await myGetServerSession()
    return session?.user?.id as string
}
