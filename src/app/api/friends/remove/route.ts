import {z} from "zod";

export async function POST(request: Request) {
    try{
        z.object({idToRemove: z.string()}).parse(await request.json());
    }catch{
        return new Response('invalid input', {status: 422});
    }
    return new Response('OK');
}
