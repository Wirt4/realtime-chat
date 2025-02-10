import {
    PusherAddFriendInterface, PusherDenyFriendInterface,

} from "@/services/pusher/interfaces";

import { aFriendsRepository } from "@/repositories/friends/abstract";
import { aUserRepository } from "@/repositories/user/abstract";

export class FriendsService {


    private userRepository: aUserRepository;
    private friendsRepository: aFriendsRepository;
    private friendsRequestRepository: aFriendsRepository;
    private denyPusher: PusherDenyFriendInterface;
    private addPusher: PusherAddFriendInterface;

    constructor(
        userRepository: aUserRepository,
        friendsRepository: aFriendsRepository,
        friendsRequestRepository: aFriendsRepository,
        denyPusher: PusherDenyFriendInterface,
        addPusher: PusherAddFriendInterface
    ) {
        this.userRepository = userRepository;
        this.friendsRepository = friendsRepository;
        this.friendsRequestRepository = friendsRequestRepository;
        this.denyPusher = denyPusher;
        this.addPusher = addPusher;
    }

    async userExists(email: string): Promise<boolean> {
        return this.userRepository.exists(email)
    }

    async isAlreadyAddedToFriendRequests(ids: Ids): Promise<boolean> {
        //replace
        return this.friendsRequestRepository.exists(ids.sessionId, ids.requestId)
    }


    async handleFriendAdd(ids: Ids): Promise<void> {
        const user = await this.userRepository.getUser(ids.sessionId)
        const senderEmail = user.email;
        await this.addPusher.addFriendRequest(ids.sessionId, ids.requestId, senderEmail)
        //replace
        await this.friendsRequestRepository.add(ids.requestId, ids.sessionId);
    }

    async getIdToAdd(email: string): Promise<string> {
        const id = await this.userRepository.getId(email);
        return id || ""
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
        try {
            await this.denyPusher.denyFriendRequest(ids.sessionId, ids.requestId)
        } catch {
            throw 'Pusher Error'
        }
    }

    async removeFriends(ids: Ids): Promise<void> {
        await Promise.all([
            this.friendsRepository.remove(ids.sessionId, ids.requestId),
            this.friendsRepository.remove(ids.requestId, ids.sessionId),
        ])
    }
}

export enum FriendRequestStatus {
    AlreadyFriends = 'Already Friends',
    NoExistingFriendRequest = 'No Existing Friend Request'
}
