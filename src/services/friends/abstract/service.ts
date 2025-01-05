import {IAbstractFriendsService} from "@/services/friends/abstract/interface";
import {IAbstractFriendsRepository} from "@/repositories/friends/interfaces";

export abstract class AbstractFriendsService implements IAbstractFriendsService {

    protected repository: IAbstractFriendsRepository

    protected constructor(repository: IAbstractFriendsRepository) {
        this.repository = repository
    }

    async areAlreadyFriends(ids: Ids): Promise<boolean> {
            return this.repository.areFriends(ids.sessionId, ids.requestId)
    }
}
