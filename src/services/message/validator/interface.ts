import { SenderHeader } from "@/schemas/senderHeaderSchema"
import { Message } from "@/lib/validations/messages";
export interface MessageValidatorInterface {
    validateChatId(chatId: string): void
    validateProfile(profile: SenderHeader): void
    validateMessageArray(messages: Message[]): void
    validateMessageText(text: string): void
}
