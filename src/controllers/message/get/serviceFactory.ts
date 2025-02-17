import { GetMessagesInterface } from "@/services/message/interface";
import { MessageService } from "@/services/message/service";

export function getMessageServiceFactory(): GetMessagesInterface {
    return new MessageService();
}
