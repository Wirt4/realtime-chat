import {
    PusherAddFriendInterface, PusherDenyFriendInterface,
    ServiceInterfacePusherFriendsAccept
} from "@/services/pusher/interface";
import {FriendsAbstractInterface, FriendsAddInterface, FriendsDenyInterface} from "@/repositories/friends/interfaces";

export interface AcceptFriendsServiceInterface {
    handleFriendRequest(ids: addIds, friendsRepository: FriendsAddInterface, pusherService: ServiceInterfacePusherFriendsAccept): Promise<void>
}

export interface DenyFriendsServiceInterface{
    removeEntry(ids: removeIds, repository:FriendsDenyInterface, pusher: PusherDenyFriendInterface): Promise<void>,
}

export interface AddFriendsServiceInterface {
    handleFriendAdd(ids: addIds, senderEmail: string, friendsRepository: FriendsAddInterface, pusherService: PusherAddFriendInterface): Promise<void>
    getIdToAdd(email: string, friendsRepository: FriendsAbstractInterface): Promise<string>,
    isSameUser(ids:addIds): boolean
    isAlreadyAddedToFriendRequests(ids: addIds, friendsRepository: FriendsAbstractInterface): Promise<boolean>
    userExists(email: string, friendsRepository: FriendsAbstractInterface): Promise<boolean>
    areAlreadyFriends(ids: addIds, friendsRepository: FriendsAbstractInterface): Promise<boolean>
}
