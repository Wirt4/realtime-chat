import {
    FriendsAbstractInterface,
    FriendsAddInterface, FriendsDenyInterface,
} from "@/repositories/friends/interfaces";
import {
    PusherAddFriendInterface, PusherDenyFriendInterface,
    ServiceInterfacePusherFriendsAccept
} from "@/services/pusher/interface";
import {
    AcceptFriendsServiceInterface,
    AddFriendsServiceInterface,
    DenyFriendsServiceInterface
} from "@/services/friends/interfaces";

export class FriendsService
    implements
        AcceptFriendsServiceInterface,
        AddFriendsServiceInterface,
DenyFriendsServiceInterface{

    async userExists(email: string, friendsRepository: FriendsAbstractInterface): Promise<boolean>{
        return friendsRepository.userExists(email)
    }

    async areAlreadyFriends(ids: addIds, friendsRepository: FriendsAbstractInterface): Promise<boolean>{
        return friendsRepository.areFriends(ids.userId, ids.toAdd)
    }

    async isAlreadyAddedToFriendRequests(ids: addIds, friendsRepository: FriendsAbstractInterface): Promise<boolean>{
        return friendsRepository.hasExistingFriendRequest(ids.userId, ids.toAdd)
    }

    async handleFriendRequest(ids: addIds, friendsRepository: FriendsAddInterface, pusherService: ServiceInterfacePusherFriendsAccept): Promise<void>{
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

    async handleFriendAdd(ids: addIds, senderEmail: string, friendsRepository: FriendsAddInterface, pusherService: PusherAddFriendInterface): Promise<void>{
        await pusherService.addFriendRequest(ids.userId, ids.toAdd, senderEmail)
        await friendsRepository.addToFriendRequests(ids.userId, ids.toAdd)
    }

    async getIdToAdd(email: string, friendsRepository: FriendsAbstractInterface): Promise<string>{
        return friendsRepository.getUserId(email)
    }

    isSameUser(ids:addIds): boolean{
        return ids.userId == ids.toAdd
    }

    async removeEntry(ids:removeIds, repository:FriendsDenyInterface, pusher: PusherDenyFriendInterface ): Promise<void> {
        try{
           await repository.removeEntry(ids)
        }catch{
            throw 'Redis Error'
        }
        try{
            await pusher.denyFriendRequest(ids.userId, ids.toRemove)
        }catch {
            throw 'Pusher Error'
        }
    }

}

export enum FriendRequestStatus{
    AlreadyFriends = 'Already Friends',
    NoExistingFriendRequest = 'No Existing Friend Request'
}
