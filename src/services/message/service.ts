import { GetMessagesInterface, MessageRemoveAllInterface, MessageSendInterface } from "@/services/message/interface";
import { nanoid } from "nanoid";
import { Message } from "@/lib/validations/messages";
import { messagePusherFactory, messageRepositoryFactory } from "./factories";
import { MessageRepositoryFacade } from "./repositoryFacade";
import { SenderHeader, senderHeaderSchema } from "@/schemas/senderHeaderSchema";
import { z } from "zod";
import { PusherSendMessageInterface } from "../pusher/interfaces";
import { Utils } from "@/lib/utils";

export class MessageService implements
    MessageSendInterface,
    GetMessagesInterface,
    MessageRemoveAllInterface {
    private readonly repoFacade: MessageRepositoryFacade
    private readonly pusher: PusherSendMessageInterface
    constructor() {
        this.repoFacade = messageRepositoryFactory()
        this.pusher = messagePusherFactory()
    }

    /**
     * Checks if the user is a member of the chat
     * @param chatProfile 
     * @returns Promise<boolean>
     */
    async isValidChatMember(chatProfile: SenderHeader): Promise<boolean> {
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
        this.validateProfile(chatProfile);
        this.validateMessageContent(text);
        const messageId: string = nanoid();
        const date: number = Date.now();
        const msg = { id: messageId, senderId: chatProfile.sender, text, timestamp: date };
        return this.sendAndPush(chatProfile.id, msg);
    }

    /**
     * 
     * @param chatId - a non-empty, valid chatID
     * @returns Promise<void>
     */
    async deleteChat(chatId: string,): Promise<void> {
        this.validateChatId(chatId);
        await this.repoFacade.removeAllMessages(chatId);
    }

    async getMessages(chatId: string): Promise<Message[]> {
        this.validateChatId(chatId);
        const messages = await this.repoFacade.getMessages(chatId)
        this.validateMessageArray(messages);
        return messages
    }

    private validateMessageContent(text: string): void {
        try {
            this.validateNonEmptyString(text)
        } catch (e) {
            throw new Error('Invalid message text')
        }
    }

    private validateChatId(chatId: string): void {
        try {
            this.validateNonEmptyString(chatId)
            this.validateChatFormat(chatId)
        } catch {
            throw new Error('Invalid chatId')
        }
    }

    private validateChatFormat(chatId: string): void {
        if (!Utils.isValidChatId(chatId)) {
            throw new Error('Invalid chatId')
        }
    }

    private validateProfile(profile: SenderHeader): void {
        try {
            senderHeaderSchema.parse(profile)
        } catch {
            throw new Error('Invalid chat profile')
        }
    }

    private validateNonEmptyString(text: string): void {
        const schema = z.string().nonempty()
        schema.parse(text)
    }

    private async sendAndPush(chatId: string, message: Message): Promise<void> {
        await Promise.all([
            this.repoFacade.sendMessage(chatId, message),
            this.pusher.sendMessage(chatId, message)
        ])
    }

    private validateMessageArray(messages: Message[]): void {
        const schema = z.array(z.object({
            id: z.string(),
            senderId: z.string(),
            text: z.string(),
            timestamp: z.number()
        }));
        try {
            schema.parse(messages);
        } catch {
            throw new Error('Repository error, invalid format');
        }
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
