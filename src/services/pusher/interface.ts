export interface ServiceInterfacePusherFriendsAccept {
    addFriend(idToAdd: string, user: User):Promise<void>
}

export interface PusherAddFriendInterface {
    addFriendRequest(userId:string, idToAdd: string, email: string):Promise<void>
}

export interface PusherDenyFriendInterface {
    denyFriendRequest(userId: string, idToDeny:string): Promise<void>
}
