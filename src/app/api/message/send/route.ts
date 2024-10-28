import myGetServerSession from "@/lib/myGetServerSession";
import Participants from "@/lib/chatParticipants.js";

export async function POST(request: Request) {
    const session = await myGetServerSession()
    const {chatId} = await request.json()
    const chatParticipants = new Participants(chatId, session?.user?.id as string )

    if (!chatParticipants.includesSession()){
        return new Response('Unauthorized', {status: 401})
    }

}
