import {Ids} from "@/services/friends/service";
import {
    PusherAddFriendInterface,
    ServiceInterfacePusherFriendsAccept
} from "@/services/pusher/interface";
import {FriendsAbstractInterface, FriendsAddInterface} from "@/repositories/friendsRepositoryInterface";

export interface AcceptFriendsServiceInterface {
    handleFriendRequest(ids: Ids, friendsRepository: FriendsAddInterface, pusherService: ServiceInterfacePusherFriendsAccept): Promise<void>
}

export interface AddFriendsServiceInterface {
    handleFriendAdd(ids: Ids, senderEmail: string, friendsRepository: FriendsAddInterface, pusherService: PusherAddFriendInterface): Promise<void>
    getIdToAdd(email: string, friendsRepository: FriendsAbstractInterface): Promise<string>,
    isSameUser(ids:Ids): boolean
    isAlreadyAddedToFriendRequests(ids: Ids, friendsRepository: FriendsAbstractInterface): Promise<boolean>
}
