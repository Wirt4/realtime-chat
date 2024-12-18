import {FriendsRepositoryInterface} from "@/repositories/friendsRepositoryInterface";
import {PusherServiceInterface} from "@/services/pusherServiceInterface";

interface Ids{
    toAdd: string,
    userId: string
}

export class FriendsService{

    async handleFriendRequest(ids: Ids, friendsRepository: FriendsRepositoryInterface, pusherService: PusherServiceInterface): Promise<void>{

        if (await friendsRepository.areFriends(ids.userId, ids.toAdd)) {
            throw FriendRequestStatus.AlreadyFriends
        }

        if (!await friendsRepository.hasExistingFriendRequest(ids.userId, ids.toAdd)) {
            throw FriendRequestStatus.NoExistingFriendRequest
        }

        const toAdd = await friendsRepository.getUser(ids.toAdd)
        const user = await friendsRepository.getUser(ids.userId)

        await Promise.all([
            friendsRepository.addToFriends(ids.toAdd, ids.userId),
            friendsRepository.addToFriends(ids.userId, ids.toAdd),
            pusherService.triggerPusher(ids.toAdd, user),
            pusherService.triggerPusher(ids.userId, toAdd),
        ])
    }
}

export enum FriendRequestStatus{
    AlreadyFriends = 'Already Friends',
    NoExistingFriendRequest = 'No Existing Friend Request'
}
