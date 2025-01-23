import {
    PusherAddFriendInterface,
} from "@/services/pusher/interfaces";

import { aFriendsRepository } from "@/repositories/friends/abstract";

export interface DenyFriendsServiceInterface {
    removeEntry(ids: Ids,): Promise<void>,
}

export interface AddFriendsServiceInterface {
    handleFriendAdd(ids: Ids, senderEmail: string, friendsRepository: aFriendsRepository, pusherService: PusherAddFriendInterface): Promise<void>
    getIdToAdd(email: string): Promise<string>,
    isSameUser(ids: Ids): boolean
    isAlreadyAddedToFriendRequests(ids: Ids): Promise<boolean>
    userExists(email: string): Promise<boolean>
    areAlreadyFriends(ids: Ids): Promise<boolean>
}
