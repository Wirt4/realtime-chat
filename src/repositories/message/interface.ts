import {Message} from "@/lib/validations/messages";

export interface SendMessageRepositoryInterface {
    sendMessage(chatId: string, message: Message): Promise<void>
}

export interface RemoveAllMessagesRepositoryInterface {
    removeAllMessages(chatId: string): Promise<void>
}