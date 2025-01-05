export interface IDenyFriendsService{
    removeEntry(ids: Ids): Promise<void>,
}
