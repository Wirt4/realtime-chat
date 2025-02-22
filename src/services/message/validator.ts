import { SenderHeader } from "@/schemas/senderHeaderSchema"

export interface MessageValidatorInterface {
    validateChatId(chatId: string): void
    validateMessageContent(text: string): void
    validateProfile(profile: SenderHeader): void
    validateMessageArray(Message: []): void
    validateMessageContent(text: string): void
}

export class MessageValidator implements MessageValidatorInterface {
    validateChatId(chatId: string): void {
        throw new Error("Method not implemented.")
    }
    validateMessageContent(text: unknown): void {
        throw new Error("Method not implemented.")
    }
    validateProfile(profile: SenderHeader): void {
        throw new Error("Method not implemented.")
    }
    validateMessageArray(Message: []): void {
        throw new Error("Method not implemented.")
    }
}
