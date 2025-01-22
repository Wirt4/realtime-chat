import { Message } from "@/lib/validations/messages";

export abstract class aSendMessageRepository {
    abstract sendMessage(chatId: string, message: Message): Promise<void>;
}
