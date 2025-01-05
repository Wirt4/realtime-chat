export interface IAbstractFriendsService{
    areAlreadyFriends(ids: Ids): Promise<boolean>
}
