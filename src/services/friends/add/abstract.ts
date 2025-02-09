export abstract class aAddFriendService {
    abstract triggerEvent(ids: Ids, senderEmail: string): Promise<void>;
    abstract storeFriendRequest(ids: Ids): Promise<void>;
    abstract getIdToAdd(email: string): Promise<string>;
}
