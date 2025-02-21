import { Message } from "@/lib/validations/messages";


export interface MessageSendInterface extends MessageServiceInterface {
    areFriends(chatProfile: SenderHeader): Promise<boolean>
    sendMessage(chatProfile: SenderHeader, text: string): Promise<void>
}

export interface MessageRemoveAllInterface extends MessageServiceInterface {
    deleteChat(chatId: string): Promise<number>
}

export interface GetMessagesInterface {
    getMessages(chatId: string): Promise<Message[]>
}

interface MessageServiceInterface {
    isValidChatMember(chatProfile: SenderHeader): Promise<boolean>
}
