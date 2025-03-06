export abstract class aChatProfileRepository {
    abstract createChatProfile(chatId: string, members: Set<string>): Promise<void>;
    abstract getChatProfile(chatId: string): Promise<ChatProfile>;
    abstract addChatMember(chatId: string, userId: string): Promise<void>;
    abstract overWriteChatProfile(profile: ChatProfile): Promise<void>;
}
