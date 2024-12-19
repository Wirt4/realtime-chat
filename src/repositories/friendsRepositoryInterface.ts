export interface RequestInterface {
    areFriends(userId:string, idToAdd: string): Promise<boolean>;
    hasExistingFriendRequest(userId:string, idToAdd: string): Promise<boolean>;
    addToFriends(userId:string, idToAdd: string): Promise<void>;
    getUser(userId: string): Promise<User>;
    removeFriendRequest(userId: string, idToAdd: string): Promise<void>;
}

export interface AddInterface{
    addToFriendRequests(userId: string, idToAdd: string): Promise<void>;
}
