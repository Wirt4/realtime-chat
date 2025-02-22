import { Utils } from "@/lib/utils";
import { SenderHeader, senderHeaderSchema } from "@/schemas/senderHeaderSchema"
import { z } from 'zod';
import { MessageValidatorInterface } from "./interface";

export class MessageValidator implements MessageValidatorInterface {
    validateChatId(chatId: string): void {
        if (!(Utils.isValidChatId(chatId) && this.isValidNonEmptyString(chatId))) {
            throw new Error('Invalid chatId')
        }
    }

    validateMessageText(text: string): void {
        if (!this.isValidNonEmptyString(text)) {
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
