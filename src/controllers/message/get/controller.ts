import { AbstractMessageController } from "../abstractController";
import { GetMessagesInterface } from "@/services/message/interface";
import { getMessageServiceFactory } from "./serviceFactory";
import myGetServerSession from "@/lib/myGetServerSession";
import { Utils } from "@/lib/utils";

export class GetMessageController extends AbstractMessageController {
    private service: GetMessagesInterface;
    constructor(service: GetMessagesInterface = getMessageServiceFactory()) {
        super();
        this.service = service;
    }
    public async execute(request: Request): Promise<Response> {
        console.log('controller called')
        if (request.method !== "GET") {
            return new Response(JSON.stringify({}), { status: 405 });
        }

        const url = new URL(request.url);
        const chatId = url.searchParams.get("id");

        if (!(chatId && Utils.isValidChatId(chatId))) {
            return new Response(JSON.stringify({}), { status: 400 });
        }

        const session = await myGetServerSession();
        if (!session) {
            return new Response(JSON.stringify({}), { status: 401 });
        }

        const messages = await this.service.getMessages(chatId);
        return new Response(JSON.stringify({ data: messages }), { status: 200 });
    }

}
