import myGetServerSession from "@/lib/myGetServerSession";
import Participants from "@/lib/chatParticipants.js";
import fetchRedis from "@/helpers/redis";
import QueryBuilder from "@/lib/queryBuilder";

export async function POST(request: Request) {
    const session = await myGetServerSession()
    const {chatId} = await request.json()

    const chatParticipants = new Participants(chatId, session?.user?.id as string )
    const query = QueryBuilder.friends(session?.user.id as string )

    const friendList = await fetchRedis('smembers', query) as string[]

    if (!chatParticipants.includesSession() || !friendList.includes(chatParticipants.partnerId())){
        return new Response('Unauthorized', {status: 401})
    }

}
