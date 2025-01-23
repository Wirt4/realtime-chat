export abstract class aAddFriendsFacade {
    abstract store(ids: Ids): Promise<void>;
    abstract getUserId(email: string): Promise<string>;
    abstract areFriends(ids: Ids): Promise<boolean>;
    abstract userExists(email: string): Promise<boolean>;
    abstract hasFriendRequest(ids: Ids): Promise<boolean>;
}
