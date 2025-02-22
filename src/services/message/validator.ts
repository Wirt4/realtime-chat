import { Utils } from "@/lib/utils";
import { SenderHeader, senderHeaderSchema } from "@/schemas/senderHeaderSchema"
import { z } from 'zod';

export interface MessageValidatorInterface {
    validateChatId(chatId: string): void
    validateProfile(profile: SenderHeader): void
    validateMessageArray(Message: []): void
    validateMessageText(text: string): void
}

export class MessageValidator implements MessageValidatorInterface {
    validateChatId(chatId: string): void {
        this.validateNonEmptyString(chatId);
        if (Utils.isValidChatId(chatId)) {
            throw new Error('Invalid chatId')
        }
    }
    validateMessageText(text: string): void {
        try {
            this.validateNonEmptyString(text)
        } catch {
            throw new Error('Invalid message text')
        }
    }
    validateProfile(profile: SenderHeader): void {
        try {
            senderHeaderSchema.parse(profile)
        } catch {
            throw new Error('Invalid chat profile')
        }
    }
    validateMessageArray(Message: []): void {
        throw new Error("Method not implemented.")
    }

    private validateNonEmptyString(text: string): void {
        const schema = z.string().nonempty();
        schema.parse(text);
    }
}
