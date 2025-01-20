import { Redis } from "@upstash/redis";
import { aFriendRequestsRepository } from "./abstract";

export class FriendRequestsRepository extends aFriendRequestsRepository {
    private database: Redis;

    constructor(db: Redis) {
        super();
        this.database = db;
    }
    async add(userId: string, friendId: string): Promise<void> {
        //stub
    }
    async remove(userId: string, friendId: string): Promise<void> {
        //stub
    }

    async exists(userId: string, friendId: string): Promise<boolean> {
        const isMember = await this.database.sismember(`user:${userId}:incoming_friend_requests`, friendId);
        return isMember === 1;
    }

    async get(userId: string): Promise<string[]> {
        return []
    }
}
