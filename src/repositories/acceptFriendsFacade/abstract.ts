export abstract class aAcceptFriendsFacade {
    abstract areFriends(ids: Ids): Promise<boolean>
    abstract hasExistingFriendRequest(ids: Ids): Promise<boolean>
    abstract getUser(id: string): Promise<User>
    abstract addFriend(ids: Ids): Promise<void>
    abstract removeRequest(ids: Ids): Promise<void>
}
