import { GetMessagesInterface, MessageRemoveAllInterface, MessageSendInterface } from "@/services/message/interface";
import { nanoid } from "nanoid";
import { Message } from "@/lib/validations/messages";
import { messageRepositoryFactory } from "./factories";
import { MessageRepositoryFacade } from "./repositoryFacade";

export class MessageService implements
    MessageSendInterface,
    GetMessagesInterface,
    MessageRemoveAllInterface {
    private readonly repoFacade: MessageRepositoryFacade
    constructor() {
        this.repoFacade = messageRepositoryFactory()
    }

    async isValidChatMember(chatProfile: SenderHeader): Promise<boolean> {
        //needs to be on record as a member of the chat, and have an exisiting friend connection with at least one other member in the chat
        //this.repoFacade.friendshipExists(chatProfile.sender, participants.getCorrespondent(chatProfile.sender))
        const profile = await this.repoFacade.getChatProfile(chatProfile.id)
        return profile.members.has(chatProfile.sender)
    }

    async sendMessage(chatProfile: SenderHeader, text: string,): Promise<void> {
        const msg = { id: nanoid(), senderId: chatProfile.sender, text, timestamp: Date.now() }
        await Promise.all([
            repository.sendMessage(chatProfile.id, msg),
            pusher.sendMessage(chatProfile.id, msg)
        ])
    }

    async deleteChat(chatId: string,): Promise<number> {
        return repository.removeAllMessages(chatId)
    }

    async getMessages(chatId: string): Promise<Message[]> {
        return repository.getMessages(chatId)
    }
}

class Participants {
    private readonly user1: string
    private readonly user2: string
    constructor(chatId: string) {
        const [user1, user2] = chatId.split('--')
        this.user1 = user1
        this.user2 = user2
    }

    isParticipant(userId: string): boolean {
        //outdated logic
        return userId === this.user1 || userId === this.user2
    }

    getCorrespondent(userId: string): string {
        return userId === this.user1 ? this.user2 : this.user1
    }
}
