import {z} from "zod";
import {getServerSession} from "next-auth";

export async function POST(request: Request) {
    try{
        z.object({idToRemove: z.string()}).parse(await request.json());
    }catch{
        return respond("Invalid Input", 422)
    }

    const session = await getServerSession()

    if (!session) {
        return respond('Unauthorized', 401)
    }
    return respond('Not Friends', 400);
}

function respond(message: string, status: number) {
    return new Response(message, {status});
}
