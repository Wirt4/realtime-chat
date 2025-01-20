export abstract class aUserRepository {
    abstract exists(email: string): Promise<boolean>;
    abstract get(userId: string): Promise<User>;
}
