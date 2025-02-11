import { FriendsRepository } from "@/repositories/friends/friendsImplementation";
import { FriendRequestsRepository } from "@/repositories/friends/requestsImplementation";
import { aAcceptFriendsFacade } from "./abstract";
import { Redis } from "@upstash/redis";
import { UserRepository } from "../user/implementation";
import { ChatProfileService } from "@/services/chatProfile/implementation";


export class AcceptFriendsFacade extends aAcceptFriendsFacade {
    private friendsRepository: FriendsRepository;
    private friendsRequestRepository: FriendRequestsRepository;
    private userRepository: UserRepository;

    constructor(db: Redis) {
        super();
        this.friendsRepository = new FriendsRepository(db);
        this.friendsRequestRepository = new FriendRequestsRepository(db);
        this.userRepository = new UserRepository(db);
    }

    areFriends(ids: Ids): Promise<boolean> {
        return this.friendsRepository.exists(ids.sessionId, ids.requestId);
    }

    hasExistingFriendRequest(ids: Ids): Promise<boolean> {
        return this.friendsRequestRepository.exists(ids.sessionId, ids.requestId);
    }

    getUser(id: string): Promise<User> {
        return this.userRepository.getUser(id);
    }

    async addFriend(ids: Ids): Promise<void> {
        await this.friendsRepository.add(ids.sessionId, ids.requestId);
    }

    async removeRequest(ids: Ids): Promise<void> {
        await this.friendsRequestRepository.remove(ids.sessionId, ids.requestId);
    }
}
