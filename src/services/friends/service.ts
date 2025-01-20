import {
    FriendsAbstractInterface,
    FriendsDenyInterface, FriendsRemoveInterface,
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
import { aFriendsRepository } from "@/repositories/friends/abstract";
import { aFriendRequestsRepository } from "@/repositories/friendRequests/abstract";
import { aUserRepository } from "@/repositories/user/abstract";

export class FriendsService
    implements
    AcceptFriendsServiceInterface,
    AddFriendsServiceInterface,
    DenyFriendsServiceInterface,
    RemoveFriendsServiceInterface {


    private userRepository: aUserRepository;
    private friendsRepository: aFriendsRepository;
    private friendsRequestRepository: aFriendRequestsRepository;
    private acceptPusher: ServiceInterfacePusherFriendsAccept;
    private denyPusher: PusherDenyFriendInterface;

    constructor(
        userRepository: aUserRepository,
        friendsRepository: aFriendsRepository,
        friendsRequestRepository: aFriendRequestsRepository,
        acceptPusher: ServiceInterfacePusherFriendsAccept,
        denyPusher: PusherDenyFriendInterface
    ) {
        this.userRepository = userRepository;
        this.friendsRepository = friendsRepository;
        this.friendsRequestRepository = friendsRequestRepository;
        this.acceptPusher = acceptPusher;
        this.denyPusher = denyPusher;
    }

    async userExists(email: string): Promise<boolean> {
        return this.userRepository.exists(email)
        //return friendsRepository.userExists(email)
    }

    async areAlreadyFriends(ids: Ids): Promise<boolean> {
        return false
        // return this.friendsRepository.exists(ids.sessionId, ids.requestId)
    }

    async isAlreadyAddedToFriendRequests(ids: Ids, friendsRepository: FriendsAbstractInterface): Promise<boolean> {
        //replace
        return friendsRepository.hasExistingFriendRequest(ids.sessionId, ids.requestId)
    }

    async handleFriendRequest(ids: Ids,): Promise<void> {
        const areAlreadyFriends = await this.friendsRepository.exists(ids.requestId, ids.sessionId); //stub
        if (areAlreadyFriends) {
            throw FriendRequestStatus.AlreadyFriends
        }

        const hasExistingFriendRequest = await this.friendsRequestRepository.exists(ids.sessionId, ids.requestId)
        if (!hasExistingFriendRequest) {
            throw FriendRequestStatus.NoExistingFriendRequest
        }

        const toAdd = await this.userRepository.get(ids.requestId)
        const user = await this.userRepository.get(ids.sessionId)

        await Promise.all([
            this.friendsRepository.add(ids.requestId, ids.sessionId),
            this.friendsRepository.add(ids.sessionId, ids.requestId),
            this.friendsRequestRepository.remove(ids.sessionId, ids.requestId),
            this.acceptPusher.addFriend(ids.requestId, user),
            this.acceptPusher.addFriend(ids.sessionId, toAdd),
        ])

    }

    async handleFriendAdd(ids: Ids, senderEmail: string, friendRequestRepository: aFriendRequestsRepository, pusherService: PusherAddFriendInterface): Promise<void> {
        await pusherService.addFriendRequest(ids.sessionId, ids.requestId, senderEmail)
        //replace
        await friendRequestRepository.add(ids.sessionId, ids.requestId)
    }

    async getIdToAdd(email: string): Promise<string> {
        const user = await this.userRepository.get(email)
        return user.id //possibly unnecessary work here
    }

    isSameUser(ids: Ids): boolean {
        return ids.sessionId == ids.requestId
    }

    async removeEntry(ids: Ids): Promise<void> {
        try {
            await this.friendsRequestRepository.remove(ids.requestId, ids.sessionId);
        } catch {
            throw 'Redis Error'
        }
        /* try {
           //  await pusher.denyFriendRequest(ids.sessionId, ids.requestId)
         } catch {
             throw 'Pusher Error'
         }*/
    }

    async removeFriends(ids: Ids, friendsRepository: FriendsRemoveInterface): Promise<void> {
        await Promise.all([
            friendsRepository.removeFriend(ids.sessionId, ids.requestId),
            friendsRepository.removeFriend(ids.requestId, ids.sessionId),
        ])
    }
}

export enum FriendRequestStatus {
    AlreadyFriends = 'Already Friends',
    NoExistingFriendRequest = 'No Existing Friend Request'
}
