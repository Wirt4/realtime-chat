import { aFriendsRepository } from '@/repositories/friends/abstract';
import { FriendsTemplateRepository } from '@/repositories/friends/template';
import { Redis } from '@upstash/redis';

export class FriendsRepository extends aFriendsRepository {
    private readonly template: FriendsTemplateRepository;

    constructor(db: Redis) {
        super();
        this.template = new FriendsTemplateRepository(db, 'friends');
    }

    /**
     * precondition: userId and friendId are seperate, valid, nonempety userID strings
     * @param userId 
     * @param friendId 
     * postcondition: friendId is added to userId's friends list in the database
     */
    async add(userId: string, friendId: string): Promise<void> {
        this.precondition(userId, friendId);
        await this.template.add(userId, friendId);
    }

    async get(userId: string): Promise<string[]> {
        return this.template.get(userId);
    }

    async exists(userId: string, friendId: string): Promise<boolean> {
        console.log('exists called with userId:', userId, 'friendId:', friendId)
        return this.template.exists(userId, friendId);
    }

    async remove(userId: string, friendId: string): Promise<void> {
        await this.template.remove(userId, friendId);
    }

    private precondition(userId: string, friendId: string): void {
        if (userId === '' || friendId === '') {
            throw new Error('userId and friendId must be nonempty strings');
        }
        if (userId === friendId) {
            throw new Error('userId and friendId must be different');
        }
    }
}
