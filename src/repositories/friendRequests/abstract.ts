export abstract class aFriendRequestsRepository {
    abstract add(userId: string, friendId: string): Promise<void>;
    abstract remove(userId: string, friendId: string): Promise<void>;
    abstract exists(userId: string, friendId: string): Promise<boolean>;
    abstract get(userId: string): Promise<string[]>;
}
