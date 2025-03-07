export abstract class aUserRepository {
    abstract exists(email: string): Promise<boolean>;
    abstract getId(email: string): Promise<string | null>;
    abstract getUser(userId: string): Promise<User>;
    abstract getUserChats(userId: string): Promise<Set<string>>;
    abstract removeUserChat(userId: string, chatId: string): Promise<void>;
    abstract addUserChat(userId: string, chatId: string): Promise<void>;
}
