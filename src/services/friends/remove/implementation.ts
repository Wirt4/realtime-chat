import { idToRemoveSchema } from "@/schemas/idToRemoveSchema";
import { aRemoveFriendsService } from "./abstact";
import { aFriendsRepository } from '@/repositories/friends/abstract';

export class RemoveFriendsService extends aRemoveFriendsService {
    private friendsRepository: aFriendsRepository;

    constructor(friendsRepository: aFriendsRepository) {
        super()
        this.friendsRepository = friendsRepository;
    }

    async removeFriends(ids: Ids): Promise<void> {
        if (!await this.friendsRepository.exists(ids.requestId, ids.sessionId)) return;
        await Promise.all([
            this.friendsRepository.remove(ids.requestId, ids.sessionId),
            this.friendsRepository.remove(ids.sessionId, ids.requestId)
        ]);
    }

    getIdToRemove(body: { idToRemove: string; }): string {
        return idToRemoveSchema.parse(body).idToRemove;
    }
}
