
export interface FriendsAbstractInterface {
    hasExistingFriendRequest(userId: string, idToAdd: string): Promise<boolean>;
    userExists(email: string): Promise<boolean>;
    areFriends(userId: string, idToAdd: string): Promise<boolean>;
    getUserId(email: string): Promise<string>;
}
