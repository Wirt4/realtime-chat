export abstract class aRemoveFriendsService {
    abstract areAlreadyFriends(ids: Ids): Promise<boolean>
    abstract removeFriends(ids: Ids): Promise<void>
}
