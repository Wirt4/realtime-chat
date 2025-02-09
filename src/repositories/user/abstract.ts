export abstract class aUserRepository {
    abstract exists(email: string): Promise<boolean>;
    abstract getId(email: string): Promise<string | null>;
    abstract getUser(userId: string): Promise<User>;
}
