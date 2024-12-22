import {MessageSendInterface} from "@/services/message/interface";

export class MessageService implements MessageSendInterface{
    isChatMember(userId: string, chatId: string): boolean {
        const [user1, user2] = chatId.split('--')
        return userId === user1 || userId === user2
    }
//TODO: Implement areFriends
    areFriends(userId: string, chatId: string): Promise<boolean> {
        return Promise.resolve(true)
    }
//TODO: Implement sendMessage
    sendMessage(userId: string, chatId: string, text: string): Promise<void> {
        return Promise.resolve()
    }
}
