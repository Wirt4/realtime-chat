import { Redis } from "@upstash/redis";
import { aFriendRequestsRepository } from "./abstract";

export class FriendRequestsRepository extends aFriendRequestsRepository {
    private database: Redis;

    constructor(db: Redis) {
        super();
        this.database = db;
    }
    async add(userId: string, friendId: string): Promise<void> {
        await this.templatefunction(this.database.sadd, userId, friendId);
    }

    async remove(userId: string, friendId: string): Promise<void> {
        await this.templatefunction(this.database.srem, userId, friendId);
    }

    async exists(userId: string, friendId: string): Promise<boolean> {
        const isMember = await this.templatefunction(this.database.sismember, userId, friendId);
        return isMember === 1;
    }

    async get(userId: string): Promise<string[]> {
        return this.database.smembers(this.template(userId));
    }

    private async templatefunction(redisMethod: (queryString: string, field: string) => Promise<number>, userId: string, friendId: string): Promise<number> {
        return redisMethod(this.template(userId), friendId);
    }

    private template(userId: string): string {
        return `user:${userId}:incoming_friend_requests`
    }
}
