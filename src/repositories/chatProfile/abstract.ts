export abstract class aChatProfileRepository {
    abstract createChatProfile(chatId: string): Promise<void>;
    abstract getChatProfile(chatId: string): Promise<ChatProfile>;
    abstract addChatMember(chatId: string, userId: string): Promise<void>;
    abstract overWriteChatProfile(profile: ChatProfile): Promise<void>;
}
