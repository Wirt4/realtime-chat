export interface IAbstractFriendsRepository{
    areFriends(userId: string, idToAdd: string): Promise<boolean>;
}

export interface IAddFriendsRepository extends IAbstractFriendsRepository{
    addToFriendRequests(userId: string, idToAdd: string): Promise<void>;
    hasExistingFriendRequest(userId: string, idToAdd: string): Promise<boolean>;
    getUserId(email: string): Promise<string>;
    userExists(email: string): Promise<boolean>;
}

export interface IAcceptFriendsRepository extends IAbstractFriendsRepository{
    getUser(userId: string): Promise<User>;
    addToFriends(userId:string, idToAdd: string): Promise<void>;
    removeFriendRequest(userId: string, idToAdd: string): Promise<void>;
    hasExistingFriendRequest(userId:string, idToAdd: string): Promise<boolean>;
}

export interface IDenyFriendsRepository{
    removeEntry(ids: Ids): Promise<void>;
}

export interface IRemoveFriendsRepository{
    removeFriend(userId:string, idToRemove:string): Promise<void>;
    areFriends(userId: string, idToAdd: string): Promise<boolean>;
}

export interface ISendMessageRepository {
    hasExistingFriendRequest(userId:string, idToAdd: string): Promise<boolean>;
    userExists(email: string): Promise<boolean>;
    areFriends(userId: string, idToAdd: string): Promise<boolean>;
    getUserId(email: string): Promise<string>;
}
