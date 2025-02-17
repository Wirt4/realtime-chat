export abstract class aDashboardFacade {
    abstract getFriendRequests(sessionId: string): Promise<string[]>;
    abstract getFriendIds(sessionId: string): Promise<string[]>;
    abstract getUser(userId: string): Promise<User>;
    abstract getUsersChats(userId: string): Promise<string[]>;
    abstract getChatProfile(chatId: string): Promise<ChatProfile>;
}
