import {z} from "zod";

export async function POST(request: Request) {
    try{
        const body = await request.json();
        z.object({idToRemove: z.string()}).parse(body);
    }catch{
        return new Response('text', {status: 422});
    }
    return new Response('OK');
}
