import { aDashboardFacade } from "./abstact";
import { Redis } from "@upstash/redis";
import { UserRepository } from "../user/implementation";
import { FriendRequestsRepository } from "../friends/requestsImplementation";
import { FriendsRepository } from "../friends/friendsImplementation";

export class DashboardFacade extends aDashboardFacade {
    private userRepository: UserRepository;
    private reqestRepository: FriendRequestsRepository;
    private friendsRepository: FriendsRepository;

    constructor(db: Redis) {
        super();
        this.userRepository = new UserRepository(db);
        this.reqestRepository = new FriendRequestsRepository(db);
        this.friendsRepository = new FriendsRepository(db);
    }

    async getFriendRequests(sessionId: string): Promise<string[]> {
        return this.reqestRepository.get(sessionId);
    }

    async getFriendIds(sessionId: string) {
        return this.friendsRepository.get(sessionId);
    }

    async getUser(userId: string) {
        throw new Error("Not implemented");
        return {} as User
    }
}
