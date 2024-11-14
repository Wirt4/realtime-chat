import {getServerSession} from "next-auth";
import {z} from "zod";

export async function POST(request: Request) {
    let participants: string[]

    try{
        const body = await request.json();
        participants = validateChatId(body)
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

function validateChatId(body: object): string[]{
    const chatId = z.object({chatId: z.string()}).parse(body).chatId;

    if (!validIdFormat(chatId)) {
       throw new Error('ChatId not in format of *****--****')
    }

    return chatId.split('--')
}

function validIdFormat(chatId: string): boolean{
    const regex = /^[\w-]+--[\w-]+$/;
    const stringSchema = z.string().regex(regex, { message: 'Invalid format' });
    stringSchema.safeParse(chatId);
    const parseResult = stringSchema.safeParse(chatId);
    return parseResult.success;
}
