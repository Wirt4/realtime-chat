import { GetMessagesInterface, MessageRemoveAllInterface, MessageSendInterface } from "@/services/message/interface";
import { nanoid } from "nanoid";
import { Message } from "@/lib/validations/messages";
import { messageRepositoryFactory } from "./factories";
import { MessageRepositoryFacade } from "./repositoryFacade";
import { SenderHeader, senderHeaderSchema } from "@/schemas/senderHeaderSchema";

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
        if (profile.members.has(chatProfile.sender)) {
            const members: string[] = Array.from(profile.members);
            for (let i = 0; i < members.length; i++) {
                if (members[i] === chatProfile.sender) {
                    continue;
                }
                if (await this.repoFacade.friendshipExists(chatProfile.sender, members[i])) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Sends the message to the chat and and alerts all other participants
     * @param chatProfile 
     * @param text - a non-zero string
     * @returns Promice<void>
     */
    async sendMessage(chatProfile: SenderHeader, text: string,): Promise<void> {
        console.log('chat profile', chatProfile)
        try {
            senderHeaderSchema.parse(chatProfile)
        } catch (e) {
            console.log('error', e)
            throw new Error('Invalid chat profile')
        }
        throw new Error("Invalid message text")
        const msg = { id: nanoid(), senderId: chatProfile.sender, text, timestamp: Date.now() }
        await Promise.all([
            this.repoFacade.sendMessage(chatProfile.id, msg),
            //pusher.sendMessage(chatProfile.id, msg)
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
