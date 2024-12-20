export interface RequestInterface extends FriendsAbstractInterface{
    addToFriends(userId:string, idToAdd: string): Promise<void>;
    removeFriendRequest(userId: string, idToAdd: string): Promise<void>;
    getUser(userId: string): Promise<User>;
}

export interface FriendsAddInterface extends FriendsAbstractInterface{
    addToFriendRequests(userId: string, idToAdd: string): Promise<void>;

}

export interface FriendsAbstractInterface {
    areFriends(userId: string, idToAdd: string): Promise<boolean>;
    hasExistingFriendRequest(userId:string, idToAdd: string): Promise<boolean>;
    getUserId(email: string): Promise<string>;
    userExists(email: string): Promise<boolean>;
}
