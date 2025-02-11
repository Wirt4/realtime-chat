export abstract class aChatProfileService {
    abstract getChatId(): string
    abstract createChat(): Promise<void>
    abstract addUserToChat(chatId: string, userId: string): Promise<void>
}
