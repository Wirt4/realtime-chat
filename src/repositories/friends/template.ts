import { Redis } from '@upstash/redis';
import { aFriendsRepository } from '@/repositories/friends/abstract';

export class FriendsTemplateRepository extends aFriendsRepository {
    private database: Redis;
    private queryKey: string;

    constructor(db: Redis, queryKey: string) {
        super();
        this.database = db;
        this.queryKey = queryKey;
    }

    async add(userId: string, friendId: string): Promise<void> {
        await this.database.sadd(this.template(userId), friendId);
    }

    async get(userId: string): Promise<string[]> {
        return this.database.smembers(this.template(userId));
    }

    async exists(userId: string, friendId: string): Promise<boolean> {
        const result = await this.database.sismember(this.template(userId), friendId);
        return result == 1;
    }

    async remove(userId: string, friendId: string): Promise<void> {
        await this.database.srem(this.template(userId), friendId);
    }

    private template(userId: string): string {
        return `user:${userId}:${this.queryKey}`;
    }
}
