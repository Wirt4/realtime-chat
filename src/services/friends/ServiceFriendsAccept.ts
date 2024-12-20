import {ServiceFriendsAbstract} from "@/services/friends/abstractFriendsService";
import {Ids} from "@/services/friends/abstractFriendsService";
import {RequestInterface} from "@/repositories/friendsRepositoryInterface";
import {ServiceInterfacePusherFriendsAccept} from "@/services/pusher/ServiceInterfacePusherFriendsAccept";
import {FriendRequestStatus} from "@/services/friends/serviceFriendsAdd";

export class ServiceFriendsAccept extends ServiceFriendsAbstract{

    async handleFriendRequest(ids: Ids, friendsRepository: RequestInterface, pusherService: ServiceInterfacePusherFriendsAccept): Promise<void>{
        if (await this.areAlreadyFriends(ids, friendsRepository)) {
            throw FriendRequestStatus.AlreadyFriends
        }

        if (!await this.isAlreadyAddedToFriendRequests(ids, friendsRepository)) {
            throw FriendRequestStatus.NoExistingFriendRequest
        }

        const toAdd = await friendsRepository.getUser(ids.toAdd)
        const user = await friendsRepository.getUser(ids.userId)

        await Promise.all([
            friendsRepository.addToFriends(ids.toAdd, ids.userId),
            friendsRepository.addToFriends(ids.userId, ids.toAdd),
            friendsRepository.removeFriendRequest(ids.userId, ids.toAdd),
            pusherService.addFriend(ids.toAdd, user),
            pusherService.addFriend(ids.userId, toAdd),
        ])
    }
}
