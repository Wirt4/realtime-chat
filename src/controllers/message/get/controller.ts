import { AbstractMessageController } from "../abstractController";
import { MessageRepository } from "@/repositories/message/removeAll/implementation";
import { GetMessagesInterface } from "@/services/message/interface";
import { getMessageServiceFactory } from "./serviceFactory";
import myGetServerSession from "@/lib/myGetServerSession";

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
        const session = await myGetServerSession();
        if (!session) {
            return this._respond(null, 401);
        }
        const messages = await this.service.getMessages("sidmaksfwalrwams8sjfnakwej4vgy8sdv2w--8ansdkfanwjawf-0k2kas-asjfacvgte4567", new MessageRepository());
        return this._respond(messages, 200);
    }

    private async _respond(content: any, status: number): Promise<Response> {
        return new Response(JSON.stringify({ data: content }), { status });
    }
}
