//TODO: don't use the Ids type here
export interface FriendsDenyInterface {
    removeEntry(ids: Ids): Promise<void>;
}

export interface FriendsRemoveInterface {
    removeFriend(userId: string, idToRemove: string): Promise<void>;
}

export interface FriendsAbstractInterface {
    hasExistingFriendRequest(userId: string, idToAdd: string): Promise<boolean>;
    userExists(email: string): Promise<boolean>;
    areFriends(userId: string, idToAdd: string): Promise<boolean>;
    getUserId(email: string): Promise<string>;
}
