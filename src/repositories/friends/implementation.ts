import { aFriendsRepository } from '@/repositories/friends/abstract';
import { Redis } from '@upstash/redis';

export class FriendsRepository extends aFriendsRepository {
    private readonly database: Redis;

    constructor(db: Redis) {
        super();
        this.database = db;
    }

    async add(userId: string, friendId: string): Promise<void> {
        await this.database.sadd(this.template(userId), friendId);
    }

    async get(userId: string): Promise<string[]> {
        return this.database.smembers(this.template(userId));
    }

    private template(userId: string): string {
        return `user:${userId}:friends`;
    }
}
