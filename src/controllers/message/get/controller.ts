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
        const session = await myGetServerSession();
        if (!session) {
            return new Response(JSON.stringify({}), { status: 401 });
        }
        const data = await this.service.getMessages("sidmaksfwalrwams8sjfnakwej4vgy8sdv2w--8ansdkfanwjawf-0k2kas-asjfacvgte4567", new MessageRepository());
        return new Response(JSON.stringify({ data }), { status: 200 });
    }
}
