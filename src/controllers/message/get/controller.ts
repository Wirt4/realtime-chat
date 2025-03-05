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
    /**
     * Precondition: a request object is passed with a valid chatID and method is GET
     * PostCondition: the caller is given a response object containing all messages in the chat keyed to the id
     * @param request 
     * @returns Response object contating the messages
     */
    public async execute(request: Request): Promise<Response> {

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
