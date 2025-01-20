import {
    PusherAddFriendInterface,
    ServiceInterfacePusherFriendsAccept
} from "@/services/pusher/interfaces";
import {
    FriendsAbstractInterface,
} from "@/repositories/friends/interfaces";
import { aFriendsRepository } from "@/repositories/friends/abstract";

export interface AcceptFriendsServiceInterface {
    handleFriendRequest(ids: Ids, friendsRepository: aFriendsRepository, pusherService: ServiceInterfacePusherFriendsAccept): Promise<void>
}

export interface DenyFriendsServiceInterface {
    removeEntry(ids: Ids,): Promise<void>,
}

export interface RemoveFriendsServiceInterface {
    areAlreadyFriends(ids: Ids, friendsRepository: FriendsAbstractInterface): Promise<boolean>
    removeFriends(ids: Ids): Promise<void>
}

export interface AddFriendsServiceInterface {
    handleFriendAdd(ids: Ids, senderEmail: string, friendsRepository: aFriendsRepository, pusherService: PusherAddFriendInterface): Promise<void>
    getIdToAdd(email: string, friendsRepository: FriendsAbstractInterface): Promise<string>,
    isSameUser(ids: Ids): boolean
    isAlreadyAddedToFriendRequests(ids: Ids, friendsRepository: FriendsAbstractInterface): Promise<boolean>
    userExists(email: string, friendsRepository: FriendsAbstractInterface): Promise<boolean>
    areAlreadyFriends(ids: Ids, friendsRepository: FriendsAbstractInterface): Promise<boolean>
}
