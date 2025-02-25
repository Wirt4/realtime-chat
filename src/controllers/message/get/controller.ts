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
        if (request.method !== "GET") {
            return this._respond(null, 405);
        }

        const url = new URL(request.url);
        const chatId = url.searchParams.get("id");

        if (!(chatId && Utils.isValidChatId(chatId))) {
            return this._respond(null, 400);
        }

        const session = await myGetServerSession();
        if (!session) {
            return this._respond(null, 401);
        }

        const messages = await this.service.getMessages(chatId);
        return this._respond(messages, 200);
    }

    private async _respond(content: any, status: number): Promise<Response> {
        return new Response(JSON.stringify({ data: content }), { status });
    }
}
