import { GetMessagesInterface } from "@/services/message/interface";
import { MessageService } from "@/services/message/service";
import { MessageValidator } from "@/services/message/validator/implementation";

export function getMessageServiceFactory(): GetMessagesInterface {
    const validator = new MessageValidator();
    return new MessageService(validator);
}
