export abstract class aRemoveFriendsService {
    abstract removeFriends(ids: Ids): Promise<void>
    abstract getIdToRemove(body: { idToRemove: string }): string
}
