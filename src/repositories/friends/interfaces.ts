export interface RequestInterface extends FriendsAbstractInterface{
    addToFriends(userId:string, idToAdd: string): Promise<void>;
    removeFriendRequest(userId: string, idToAdd: string): Promise<void>;
}

export interface FriendsAddInterface extends FriendsAbstractInterface{
    addToFriendRequests(userId: string, idToAdd: string): Promise<void>;
    hasExistingFriendRequest(userId:string, idToAdd: string): Promise<boolean>;
    userExists(email: string): Promise<boolean>;
    getUser(userId: string): Promise<User>;
    addToFriends(userId:string, idToAdd: string): Promise<void>;
    removeFriendRequest(userId: string, idToAdd: string): Promise<void>;
}

export interface FriendsDenyInterface{
    removeEntry(ids: removeIds): Promise<void>;
}
export interface FriendsRemoveInterface{}

export interface FriendsAbstractInterface {
    hasExistingFriendRequest(userId:string, idToAdd: string): Promise<boolean>;
    userExists(email: string): Promise<boolean>;
    areFriends(userId: string, idToAdd: string): Promise<boolean>;
    getUserId(email: string): Promise<string>;
}
