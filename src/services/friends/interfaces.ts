import {
    PusherAddFriendInterface,
    ServiceInterfacePusherFriendsAccept
} from "@/services/pusher/interfaces";

import { aFriendsRepository } from "@/repositories/friends/abstract";

export interface AcceptFriendsServiceInterface {
    handleFriendRequest(ids: Ids, friendsRepository: aFriendsRepository, pusherService: ServiceInterfacePusherFriendsAccept): Promise<void>
}

export interface DenyFriendsServiceInterface {
    removeEntry(ids: Ids,): Promise<void>,
}

export interface RemoveFriendsServiceInterface {
    areAlreadyFriends(ids: Ids): Promise<boolean>
    removeFriends(ids: Ids): Promise<void>
}

export interface AddFriendsServiceInterface {
    handleFriendAdd(ids: Ids, senderEmail: string, friendsRepository: aFriendsRepository, pusherService: PusherAddFriendInterface): Promise<void>
    getIdToAdd(email: string): Promise<string>,
    isSameUser(ids: Ids): boolean
    isAlreadyAddedToFriendRequests(ids: Ids): Promise<boolean>
    userExists(email: string): Promise<boolean>
    areAlreadyFriends(ids: Ids): Promise<boolean>
}
