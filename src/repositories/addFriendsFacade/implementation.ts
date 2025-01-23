import { FriendRequestsRepository } from "../friends/requestsImplementation";
import { aAddFriendsFacade } from "./abstract";
import { UserRepository } from "../user/implementation";
import { Redis } from "@upstash/redis";
import { FriendsRepository } from "../friends/friendsImplementation";

export class AddFriendsFacade extends aAddFriendsFacade {

    private friendsRequestRepository: FriendRequestsRepository;
    private userRepository: UserRepository;
    private friendsRepository: FriendsRepository

    constructor(database: Redis) {
        super();
        this.friendsRequestRepository = new FriendRequestsRepository(database);
        this.userRepository = new UserRepository(database);
        this.friendsRepository = new FriendsRepository(database);
    }

    async store(ids: Ids): Promise<void> {
        await this.friendsRequestRepository.add(ids.requestId, ids.sessionId);
    }

    getUserId(email: string): Promise<string> {
        return this.userRepository.getId(email) as Promise<string>;
    }

    areFriends(ids: Ids): Promise<boolean> {
        return this.friendsRepository.exists(ids.sessionId, ids.requestId);
    }

    userExists(email: string): Promise<boolean> {
        return this.userRepository.exists(email);
    }

    hasFriendRequest(ids: Ids): Promise<boolean> {
        return this.friendsRequestRepository.exists(ids.sessionId, ids.requestId);
    }
}
