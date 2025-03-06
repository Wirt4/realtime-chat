import { Redis } from "@upstash/redis";
import { aUserRepository } from "./abstract";
import QueryBuilder from "@/lib/queryBuilder";

export class UserRepository extends aUserRepository {
    private database: Redis;

    constructor(database: Redis) {
        super();
        this.database = database
    }

    async exists(email: string): Promise<boolean> {
        return Boolean(await this.getId(email));
    }

    async getId(email: string): Promise<string | null> {
        return this.database.get(QueryBuilder.email(email) as never);
    }

    async getUser(userId: string): Promise<User> {
        const user = this.database.get(QueryBuilder.user(userId) as never);
        if (!user) {
            throw new Error('User not found');
        }
        return user as unknown as User;
    }

    async getUserChats(userId: string): Promise<Set<string>> {
        const data = await this.database.smembers(this.repoKey(userId));
        return new Set(data);
    }

    async removeUserChat(userId: string, chatId: string): Promise<void> {
        await this.database.srem(this.repoKey(userId), chatId);
    }

    async addUserChat(userId: string, chatId: string): Promise<void> {
        await this.database.sadd(this.repoKey(userId), chatId);
    }

    private repoKey(userId: string): string {
        return `user:${userId}:chats`;
    }
}
