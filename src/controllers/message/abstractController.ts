import { AbstractController } from "@/controllers/abstractController";
import { MessageRepository } from "@/repositories/message/removeAll/implementation";

export abstract class AbstractMessageController extends AbstractController {
    protected readonly messageRepository: MessageRepository
    constructor() {
        super();
        this.messageRepository = new MessageRepository();
    }
}
