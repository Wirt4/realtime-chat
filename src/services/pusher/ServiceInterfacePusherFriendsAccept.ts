export interface ServiceInterfacePusherFriendsAccept {
    addFriend(idToAdd: string, user:User):Promise<void>
}

export interface PusherAddFriendInterface {
    addFriendRequest(userId:string, idToAdd: string, email: string):Promise<void>
}