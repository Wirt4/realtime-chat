import { Message } from "@/lib/validations/messages";
import { SenderHeader } from "@/schemas/senderHeaderSchema";


export interface MessageSendInterface extends MessageServiceInterface {
    sendMessage(chatProfile: SenderHeader, text: string): Promise<void>
}

export interface MessageRemoveAllInterface extends MessageServiceInterface {
    deleteChat(chatId: string): Promise<void>
}

export interface GetMessagesInterface {
    getMessages(chatId: string): Promise<Message[]>
}

interface MessageServiceInterface {
    isValidChatMember(chatProfile: SenderHeader): Promise<boolean>
}
