import {
    PusherAddFriendInterface, PusherDenyFriendInterface,
    ServiceInterfacePusherFriendsAccept
} from "@/services/pusher/interfaces";
import {
    FriendsAbstractInterface,
    FriendsAddInterface,
    FriendsDenyInterface,
    FriendsRemoveInterface
} from "@/repositories/friends/interfaces";

export interface AcceptFriendsServiceInterface {
    handleFriendRequest(ids: Ids, friendsRepository: FriendsAddInterface, pusherService: ServiceInterfacePusherFriendsAccept): Promise<void>
}

export interface DenyFriendsServiceInterface{
    removeEntry(ids: Ids, repository:FriendsDenyInterface, pusher: PusherDenyFriendInterface): Promise<void>,
}

export interface RemoveFriendsServiceInterface{
    areAlreadyFriends(ids: Ids, friendsRepository: FriendsAbstractInterface): Promise<boolean>
    removeFriends(ids: Ids, friendsRepository: FriendsRemoveInterface): Promise<void>
}

export interface AddFriendsServiceInterface {
    handleFriendAdd(ids: Ids, senderEmail: string, friendsRepository: FriendsAddInterface, pusherService: PusherAddFriendInterface): Promise<void>
    getIdToAdd(email: string, friendsRepository: FriendsAbstractInterface): Promise<string>,
    isSameUser(ids:Ids): boolean
    isAlreadyAddedToFriendRequests(ids: Ids, friendsRepository: FriendsAbstractInterface): Promise<boolean>
    userExists(email: string, friendsRepository: FriendsAbstractInterface): Promise<boolean>
    areAlreadyFriends(ids: Ids, friendsRepository: FriendsAbstractInterface): Promise<boolean>
}
