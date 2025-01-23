import { friendSchema } from '@/schemas/friendSchema';
import { aDenyFriendsService } from './abstract';
import { aFriendsRepository } from '@/repositories/friends/abstract';
import { PusherDenyFriendInterface } from '@/services/pusher/interfaces';

export class DenyFriendsService extends aDenyFriendsService {
    private requestsRepository: aFriendsRepository;
    private pusher: PusherDenyFriendInterface;

    constructor(requestsRepository: aFriendsRepository, pusher: PusherDenyFriendInterface) {
        super();
        this.requestsRepository = requestsRepository;
        this.pusher = pusher;
    }

    async removeEntry(ids: Ids): Promise<void> {
        await this.requestsRepository.remove(ids.requestId, ids.sessionId);
    }

    getIdToDeny(body: { id: string; }): string {
        return friendSchema.parse(body).id;
    }

    async triggerEvent(ids: Ids): Promise<void> {
        await this.pusher.denyFriendRequest(ids.sessionId, ids.requestId);
    }
}
