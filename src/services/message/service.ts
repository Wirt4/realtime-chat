import { GetMessagesInterface, MessageRemoveAllInterface, MessageSendInterface } from "@/services/message/interface";
import { nanoid } from "nanoid";
import { z } from "zod";

import { Message } from "@/lib/validations/messages";

import { messagePusherFactory, messageRepositoryFactory } from "./factories";
import { MessageRepositoryFacade } from "./repositoryFacade";
import { SenderHeader } from "@/schemas/senderHeaderSchema";
import { PusherSendMessageInterface } from "../pusher/interfaces";
import { Utils } from "@/lib/utils";
import { MessageValidatorInterface } from "./validator";

export class MessageService implements
    MessageSendInterface,
    GetMessagesInterface,
    MessageRemoveAllInterface {
    private readonly repoFacade: MessageRepositoryFacade
    private readonly pusher: PusherSendMessageInterface
    private readonly validator: MessageValidatorInterface
    constructor(validator: MessageValidatorInterface) {
        this.repoFacade = messageRepositoryFactory()
        this.pusher = messagePusherFactory()
        this.validator = validator
    }

    /**
     * Checks if the user is a member of the chat
     * @param chatProfile 
     * @returns Promise<boolean>
     */
    async isValidChatMember(chatProfile: SenderHeader): Promise<boolean> {
        const profile = await this.getProfile(chatProfile.id);
        if (!this.isMemberOfChat(profile, chatProfile.sender)) {
            return false;
        }
        return this.hasFriendInChat(chatProfile.sender, profile.members);
    }

    /**
     * Sends the message to the chat and and alerts all other participants
     * @param chatProfile 
     * @param text - a non-zero string
     * @returns Promice<void>
     */
    async sendMessage(chatProfile: SenderHeader, text: string,): Promise<void> {
        this.validator.validateMessageText(text);
        this.validator.validateProfile(chatProfile);
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

    /**
     * 
     * @param chatId - a non-empty, valid chatID
     * @returns array of Message objects
     */
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

    private isMemberOfChat(chatProfile: ChatProfile, sender: string): boolean {
        return chatProfile.members.has(sender);
    }

    private async getProfile(chatId: string): Promise<ChatProfile> {
        const profile = await this.repoFacade.getChatProfile(chatId)
        return profile
    }


    private async hasFriendInChat(sender: string, members: Set<string>): Promise<boolean> {
        for (const member of members) {
            if (member !== sender && await this.repoFacade.friendshipExists(sender, member)) {
                return true;
            }
        }
        return false;
    }
}
