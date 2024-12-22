import {
    FriendsAbstractInterface,
    FriendsAddInterface, FriendsDenyInterface, FriendsRemoveInterface,
} from "@/repositories/friends/interfaces";
import {
    PusherAddFriendInterface, PusherDenyFriendInterface,
    ServiceInterfacePusherFriendsAccept
} from "@/services/pusher/interfaces";
import {
    AcceptFriendsServiceInterface,
    AddFriendsServiceInterface,
    DenyFriendsServiceInterface,
    RemoveFriendsServiceInterface
} from "@/services/friends/interfaces";

export class FriendsService
    implements
        AcceptFriendsServiceInterface,
        AddFriendsServiceInterface,
        DenyFriendsServiceInterface,
        RemoveFriendsServiceInterface
{

    async userExists(email: string, friendsRepository: FriendsAbstractInterface): Promise<boolean>{
        return friendsRepository.userExists(email)
    }

    async areAlreadyFriends(ids: Ids, friendsRepository: FriendsAbstractInterface): Promise<boolean>{
        return friendsRepository.areFriends(ids.sessionId, ids.requestId)
    }

    async isAlreadyAddedToFriendRequests(ids: Ids, friendsRepository: FriendsAbstractInterface): Promise<boolean>{
        return friendsRepository.hasExistingFriendRequest(ids.sessionId, ids.requestId)
    }

    async handleFriendRequest(ids: Ids, friendsRepository: FriendsAddInterface, pusherService: ServiceInterfacePusherFriendsAccept): Promise<void>{
        if (await this.areAlreadyFriends(ids, friendsRepository)) {
            throw FriendRequestStatus.AlreadyFriends
        }

        if (!await this.isAlreadyAddedToFriendRequests(ids, friendsRepository)) {
            throw FriendRequestStatus.NoExistingFriendRequest
        }

        const toAdd = await friendsRepository.getUser(ids.requestId)
        const user = await friendsRepository.getUser(ids.sessionId)

        await Promise.all([
            friendsRepository.addToFriends(ids.requestId, ids.sessionId),
            friendsRepository.addToFriends(ids.sessionId, ids.requestId),
            friendsRepository.removeFriendRequest(ids.sessionId, ids.requestId),
            pusherService.addFriend(ids.requestId, user),
            pusherService.addFriend(ids.sessionId, toAdd),
        ])
    }

    async handleFriendAdd(ids: Ids, senderEmail: string, friendsRepository: FriendsAddInterface, pusherService: PusherAddFriendInterface): Promise<void>{
        await pusherService.addFriendRequest(ids.sessionId, ids.requestId, senderEmail)
        await friendsRepository.addToFriendRequests(ids.sessionId, ids.requestId)
    }

    async getIdToAdd(email: string, friendsRepository: FriendsAbstractInterface): Promise<string>{
        return friendsRepository.getUserId(email)
    }

    isSameUser(ids:Ids): boolean{
        return ids.sessionId == ids.requestId
    }

    async removeEntry(ids:Ids, repository:FriendsDenyInterface, pusher: PusherDenyFriendInterface ): Promise<void> {
        try{
           await repository.removeEntry(ids)
        }catch{
            throw 'Redis Error'
        }
        try{
            await pusher.denyFriendRequest(ids.sessionId, ids.requestId)
        }catch {
            throw 'Pusher Error'
        }
    }

    async removeFriends(ids: Ids, friendsRepository: FriendsRemoveInterface): Promise<void> {
        await Promise.all([
            friendsRepository.removeFriend(ids.sessionId, ids.requestId),
            friendsRepository.removeFriend(ids.requestId, ids.sessionId),
        ])
    }
}

export enum FriendRequestStatus{
    AlreadyFriends = 'Already Friends',
    NoExistingFriendRequest = 'No Existing Friend Request'
}
