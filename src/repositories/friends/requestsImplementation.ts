import { Redis } from "@upstash/redis";
import { aFriendsRepository } from '@/repositories/friends/abstract';
import { FriendsTemplateRepository } from '@/repositories/friends/template';

export class FriendRequestsRepository extends aFriendsRepository {
    private readonly template: FriendsTemplateRepository;

    constructor(db: Redis) {
        super();
        this.template = new FriendsTemplateRepository(db, 'incoming_friend_requests');
    }

    async add(userId: string, friendId: string): Promise<void> {
        await this.template.add(userId, friendId);
    }

    async get(userId: string): Promise<string[]> {
        return this.template.get(userId);
    }

    async exists(userId: string, friendId: string): Promise<boolean> {
        return this.template.exists(userId, friendId);
    }

    async remove(userId: string, friendId: string): Promise<void> {
        await this.template.remove(userId, friendId);
    }
}
