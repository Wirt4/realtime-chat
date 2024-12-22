import myGetServerSession from "@/lib/myGetServerSession";

export class MessageSendController {
    async send(request: Request): Promise<Response>{
        const session = await myGetServerSession();
        if (!session){
            return new Response(null, {status: 401})
        }
        return new Response(null, {status: 200})
    }
}
