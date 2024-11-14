import {getServerSession} from "next-auth";
import {z} from "zod";

export async function POST(request: Request) {
    let participants: string[]

    try{
        const body = await request.json()
        const chatId = z.object({chatId: z.string()}).parse(body).chatId;
        participants = chatId.split('__')
    }catch{
        return respond('Invalid Input', 422)
    }
    
    const session = await getServerSession()

    if (!(session && participants.includes(session.user.id))) {
        return respond('Unauthorized', 401)
    }

    return new Response('OK')
}

function respond(message: string, status: number) {
    return new Response(message, {status});
}
