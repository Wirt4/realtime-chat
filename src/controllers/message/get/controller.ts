import { AbstractMessageController } from "../abstractController";
import { MessageRepository } from "@/repositories/message/removeAll/implementation";
import { GetMessagesInterface } from "@/services/message/interface";

export class GetMessageController extends AbstractMessageController {
    private service: GetMessagesInterface;
    constructor(service: GetMessagesInterface) {
        super();
        this.service = service;
    }
    public async execute(request: Request): Promise<Response> {
        await this.service.getMessages('stub', new MessageRepository());

        return new Response(JSON.stringify({}), { status: 401 });
    }
}
