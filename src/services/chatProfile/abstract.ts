export abstract class aChatProfileService {
    abstract getChatId(): string
    abstract createChat(): Promise<void>
    abstract addUserToChat(userId: string): Promise<void>
    abstract loadProfileFromUsers(users: Set<string>): Promise<ChatProfile>
}
