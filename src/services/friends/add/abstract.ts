export abstract class aAddFriendService {
    abstract triggerEvent(ids: Ids, senderEmail: string): Promise<void>;
    abstract storeFriendRequest(ids: Ids): Promise<void>;
    abstract getIdFromEmail(email: string): Promise<string>;
    abstract isSameUser(ids: Ids): boolean;
    abstract areFriends(ids: Ids): Promise<boolean>;
    abstract userExits(email: string): Promise<boolean>;
    abstract hasFriendRequest(ids: Ids): Promise<boolean>;
}
