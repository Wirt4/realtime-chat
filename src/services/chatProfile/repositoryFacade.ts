export default interface chatProfileRepositoryFacade {
    getChatProfile(chatId: string): Promise<ChatProfile>;
    getUser(userId: string): Promise<User>;
    createChatProfile(chatId: string): Promise<void>;
    addChatMember(chatId: string, userId: string): Promise<void>;
    overwriteProfile(profile: ChatProfile): Promise<void>;
    getUserChats(userId: string): Promise<Set<string>>;
}
