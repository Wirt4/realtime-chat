export abstract class aAcceptFriendsService {
    abstract areFriends(ids: Ids): Promise<boolean>
    abstract hasExistingRequest(ids: Ids): Promise<boolean>
    abstract triggerEvent(ids: Ids): Promise<void>
    abstract store(ids: Ids): Promise<void>
}
