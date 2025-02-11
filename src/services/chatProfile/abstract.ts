export abstract class aChatProfileService {
    abstract createChat(): Promise<string>
    abstract addUserToChat(chatId: string, userId: string): Promise<void>
}
