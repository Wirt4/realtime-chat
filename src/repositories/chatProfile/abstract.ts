export abstract class aChatProfileRepository {
    abstract createChatProfile(chatId: string, members: Set<string>): Promise<void>;
    abstract getChatProfile(chatId: string): Promise<ChatProfile>;
}
