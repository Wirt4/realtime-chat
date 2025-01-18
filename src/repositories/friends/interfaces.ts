export interface RequestInterface extends FriendsAbstractInterface {
    addToFriends(userId: string, idToAdd: string): Promise<void>;
    removeFriendRequest(userId: string, idToAdd: string): Promise<void>;
}

export interface DashboardDataInterface {
    getIncomingFriendRequests(userId: string): Promise<string[]>;
    getFriends(userId: string): Promise<User[]>;
}

export interface FriendsAddInterface extends FriendsAbstractInterface {
    addToFriendRequests(userId: string, idToAdd: string): Promise<void>;
    hasExistingFriendRequest(userId: string, idToAdd: string): Promise<boolean>;
    userExists(email: string): Promise<boolean>;
    getUser(userId: string): Promise<User>;
    addToFriends(userId: string, idToAdd: string): Promise<void>;
    removeFriendRequest(userId: string, idToAdd: string): Promise<void>;
}

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
