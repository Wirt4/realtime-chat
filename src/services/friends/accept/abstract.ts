export abstract class aAcceptFriendsService {
    abstract triggerEvent(ids: Ids): Promise<void>
    abstract acceptFriendRequest(ids: Ids): Promise<void>
    abstract getIdToAdd(body: { id: string }): string
}
