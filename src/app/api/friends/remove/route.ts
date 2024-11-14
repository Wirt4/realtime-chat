import {z} from "zod";
import {getServerSession} from "next-auth";

export async function POST(request: Request) {
    try{
        z.object({idToRemove: z.string()}).parse(await request.json());
    }catch{
        return new Response('invalid input', {status: 422});
    }
    const session = await getServerSession()
    if (!session) {
        return new Response('bad authorization', {status: 401});
    }
    return new Response('not friends', {status: 400});
}
