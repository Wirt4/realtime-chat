export interface FriendsRepositoryInterface{
    areFriends(userId:string, idToAdd: string): Promise<boolean>;
    hasExistingFriendRequest(userId:string, idToAdd: string): Promise<boolean>;
    addToFriends(userId:string, idToAdd: string): Promise<void>;
    getUser(userId: string): Promise<any>;
}
