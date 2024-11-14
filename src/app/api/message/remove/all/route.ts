import {getServerSession} from "next-auth";
import {z} from "zod";
import {db} from "@/lib/db";

export async function POST(request: Request) {
    let chatId: ChatId

    try{
        const body = await request.json();
        chatId = validateChatId(body)
    }catch{
        return respond('Invalid Input', 422)
    }

    const session = await getServerSession()

    if (!(session && chatId.participants.includes(session.user.id))) {
        return respond('Unauthorized', 401)
    }

    await db.zrem("chat:"+chatId.id+":messages")
    return new Response('OK')
}

function respond(message: string, status: number) {
    return new Response(message, {status});
}

function validateChatId(body: object): ChatId{
    const chatId = z.object({chatId: z.string()}).parse(body).chatId;

    if (!validIdFormat(chatId)) {
       throw new Error('ChatId not in format of *****--****')
    }

    return new ChatId(chatId)
}

function validIdFormat(chatId: string): boolean{
    const regex = /^[\w-]+--[\w-]+$/;
    const stringSchema = z.string().regex(regex, { message: 'Invalid format' });
    stringSchema.safeParse(chatId);
    const parseResult = stringSchema.safeParse(chatId);
    return parseResult.success;
}

class ChatId{
    private chatId: string;

    constructor(chatId: string) {
        this.chatId = chatId;
    }

    get participants(): string[] {
        return this.chatId.split('--')
    }

    get id():string{
        return this.chatId;
    }
}
