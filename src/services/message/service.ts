import { GetMessagesInterface, MessageRemoveAllInterface, MessageSendInterface } from "@/services/message/interface";
import { nanoid } from "nanoid";
import { Message } from "@/lib/validations/messages";

import { messagePusherFactory, messageRepositoryFactory } from "./factories";
import { MessageRepositoryFacade } from "./repositoryFacade";
import { SenderHeader } from "@/schemas/senderHeaderSchema";
import { PusherSendMessageInterface } from "../pusher/interfaces";
import { MessageValidatorInterface } from "./validator/interface";

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
        console.log('calling hasFriendInChat...')
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
        this.validator.validateChatId(chatId);
        await this.repoFacade.removeAllMessages(chatId);
    }

    /**
     * 
     * @param chatId - a non-empty, valid chatID
     * @returns array of Message objects
     */
    async getMessages(chatId: string): Promise<Message[]> {
        this.validator.validateChatId(chatId);
        const messages = await this.repoFacade.getMessages(chatId);
        this.validator.validateMessageArray(messages);
        return messages;
    }

    private async sendAndPush(chatId: string, message: Message): Promise<void> {
        await Promise.all([
            this.repoFacade.sendMessage(chatId, message),
            this.pusher.sendMessage(chatId, message)
        ])
    }

    private isMemberOfChat(chatProfile: ChatProfile, sender: string): boolean {
        for (const member of chatProfile.members) {
            if (member === sender) {
                return true;
            }
        }
        return false;
    }

    private async getProfile(chatId: string): Promise<ChatProfile> {
        const profile = await this.repoFacade.getChatProfile(chatId)
        return profile
    }

    private async hasFriendInChat(sender: string, members: Set<string>): Promise<boolean> {
        for (const member of members) {
            if (member === sender) continue;
            const friendshipExists = await this.repoFacade.friendshipExists(sender, member);
            if (friendshipExists) {
                return true;
            }
        }
        return false;
    }
}
