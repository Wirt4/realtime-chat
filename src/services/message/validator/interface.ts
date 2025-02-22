import { SenderHeader } from "@/schemas/senderHeaderSchema"

export interface MessageValidatorInterface {
    validateChatId(chatId: string): void
    validateProfile(profile: SenderHeader): void
    validateMessageArray(messages: Message[]): void
    validateMessageText(text: string): void
}
