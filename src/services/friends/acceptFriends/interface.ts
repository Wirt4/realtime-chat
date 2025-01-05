export interface IAcceptFriendsService {
    handleFriendRequest(ids: Ids): Promise<void>
}
