import { Redis } from "@upstash/redis";
import { aUserRepository } from "./abstract";

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
        return this.database.get(`user:email:${email}`);
    }

    async getUser(userId: string): Promise<User> {
        const user = this.database.get(`user:${userId}`);
        if (!user) {
            throw new Error('User not found');
        }
        return user as unknown as User;
    }
}
