export abstract class aFriendsRepository {
    abstract add(userId: string, friendId: string): Promise<void>;
    abstract get(userId: string): Promise<string[]>;
    abstract exists(userId: string, friendId: string): Promise<boolean>;
    abstract remove(userId: string, friendId: string): Promise<void>;
}
