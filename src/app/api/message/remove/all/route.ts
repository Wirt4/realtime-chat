import {getServerSession} from "next-auth";
import {z} from "zod";

export async function POST(request: Request) {

    const session = await getServerSession()
    if (!session) {
        return respond('Unauthorized', 401)
    }
    let chatIncludesSessionId: boolean = false;
    try{
        const body = await request.json()
        const chatId = z.object({chatId: z.string()}).parse(body).chatId;
        chatIncludesSessionId = chatId.split('__').includes(session?.user?.id as string);
    }catch(err){
        console.log(err)
        return respond('Invalid Input', 422)
    }

    if (!chatIncludesSessionId) {
        return respond('Unauthorized', 401)
    }

}

function respond(message: string, status: number) {
    return new Response(message, {status});
}
