import {FriendsAbstractInterface, FriendsAddInterface} from "@/repositories/friendsRepositoryInterface";
import {PusherAddFriendInterface} from "@/services/pusher/ServiceInterfacePusherFriendsAccept";
import {Ids, ServiceFriendsAbstract} from "@/services/friends/abstractFriendsService";

export class ServiceFriendsAdd extends ServiceFriendsAbstract{
    async handleFriendAdd(ids: Ids, senderEmail: string, friendsRepository: FriendsAddInterface, pusherService: PusherAddFriendInterface): Promise<void>{
        await pusherService.addFriendRequest(ids.userId, ids.toAdd, senderEmail)
        await friendsRepository.addToFriendRequests(ids.userId, ids.toAdd)
    }

    async getIdToAdd(email: string, friendsRepository: FriendsAbstractInterface): Promise<string>{
        return friendsRepository.getUserId(email)
    }

    isSameUser(ids:Ids): boolean{
        return ids.userId == ids.toAdd
    }
}

export enum FriendRequestStatus{
    AlreadyFriends = 'Already Friends',
    NoExistingFriendRequest = 'No Existing Friend Request'
}
