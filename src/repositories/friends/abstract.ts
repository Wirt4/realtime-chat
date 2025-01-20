export abstract class aFriendsRepository {
    abstract get(userId: string): Promise<string[]>;
    abstract exists(userId: string, friendId: string): Promise<boolean>;
    abstract add(userId: string, friendId: string): Promise<void>;
    abstract remove(userId: string, friendId: string): Promise<void>;
}
