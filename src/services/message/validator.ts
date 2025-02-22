import { SenderHeader, senderHeaderSchema } from "@/schemas/senderHeaderSchema"

export interface MessageValidatorInterface {
    validateChatId(chatId: string): void
    validateProfile(profile: SenderHeader): void
    validateMessageArray(Message: []): void
    validateMessageText(text: string): void
}

export class MessageValidator implements MessageValidatorInterface {
    validateChatId(chatId: string): void {
        throw new Error("Method not implemented.")
    }
    validateMessageText(text: string): void {
        throw new Error("Method not implemented.")
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
}
