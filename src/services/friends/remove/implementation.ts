import { aRemoveFriendsService } from "./abstact";
import { aFriendsRepository } from '@/repositories/friends/abstract';

export class RemoveFriendsService extends aRemoveFriendsService {
    private friendsRepository: aFriendsRepository;

    constructor(friendsRepository: aFriendsRepository) {
        super()
        this.friendsRepository = friendsRepository;
    }

    areAlreadyFriends(ids: Ids): Promise<boolean> {
        return this.friendsRepository.exists(ids.requestId, ids.sessionId);
    }

    async removeFriends(ids: Ids): Promise<void> {
        await Promise.all([
            this.friendsRepository.remove(ids.requestId, ids.sessionId),
            this.friendsRepository.remove(ids.sessionId, ids.requestId)
        ]);
    }
}
