import { Utils } from "@/lib/utils";
import { SenderHeader, senderHeaderSchema } from "@/schemas/senderHeaderSchema"
import { z } from 'zod';
import { MessageValidatorInterface } from "./interface";
import { Message } from "@/lib/validations/messages";

export class MessageValidator implements MessageValidatorInterface {
    /**
     * Precondition: a chat ID is provided
     * Postcondition:
     *  happy path: code resumes exectution
     *  unhappy path: throws error
     * @param chatId 
     */
    validateChatId(chatId: string): void {
        if (!(Utils.isValidChatId(chatId) && this.isValidNonEmptyString(chatId))) {
            throw new Error('Invalid chatId')
        }
    }

    /**
     * Precondition: a message text is provided
     * Postcondition:
     *  happy path: code resumes exectution
     *  unhappy path: throws error
     * @param text 
     */
    validateMessageText(text: string): void {
        if (!this.isValidNonEmptyString(text)) {
            throw new Error('Invalid message text')
        }
    }
    /**
     * Precondition: a profile object is provided
     * Postcondition:
     *  happy path: code resumes exectution
     *  unhappy path: throws error
     * @param profile 
     */
    validateProfile(profile: SenderHeader): void {
        try {
            senderHeaderSchema.parse(profile)
        } catch {
            throw new Error('Invalid chat profile')
        }
    }
    /**
     * Precondition: an array of messages is provided
     * Postcondition: either code returns to execution or throws an error
     * @param messages 
     */
    validateMessageArray(messages: Message[]): void {
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

    private isValidNonEmptyString(text: string): boolean {
        return z.string().nonempty().safeParse(text).success
    }
}
