import {Message} from "@/lib/validations/messages";
export interface SendMessageRepositoryInterface {
    sendMessage(chatId: string, message: Message): Promise<void>
}