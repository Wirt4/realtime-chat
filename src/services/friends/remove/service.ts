import {IRemoveFriendsService} from "@/services/friends/remove/interface";
import {IRemoveFriendsRepository} from "@/repositories/friends/interfaces";
import {AbstractFriendsService} from "@/services/friends/abstract/service";

export class RemoveFriendService extends  AbstractFriendsService implements IRemoveFriendsService {

    private removeFriendsRepository: IRemoveFriendsRepository

    constructor(repository: IRemoveFriendsRepository) {
        super(repository)
        this.removeFriendsRepository = repository
    }

    async removeFriends(ids: Ids): Promise<void> {
        await Promise.all([
            this.removeFriendsRepository.removeFriend(ids.sessionId, ids.requestId),
            this.removeFriendsRepository.removeFriend(ids.requestId, ids.sessionId),
        ])
    }
}
