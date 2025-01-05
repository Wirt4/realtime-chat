import {IAddFriendsService} from "@/services/friends/add/interface";
import {IAddFriendsRepository} from "@/repositories/friends/interfaces";
import {PusherAddFriendInterface} from "@/services/pusher/interfaces";
import {AbstractFriendsService} from "@/services/friends/abstract/service";

export class AddFriendsService extends AbstractFriendsService implements IAddFriendsService{
    private pusher: PusherAddFriendInterface
    private addFriendsRepository: IAddFriendsRepository

    constructor(repository: IAddFriendsRepository, pusher: PusherAddFriendInterface){
        super(repository)
        this.addFriendsRepository = repository
        this.pusher = pusher
    }

    async handleFriendAdd(ids: Ids, senderEmail: string): Promise<void>{
        await this.addFriendsRepository.addToFriendRequests(ids.sessionId, ids.requestId)
        await this.pusher.addFriendRequest(ids.sessionId, ids.requestId, senderEmail)
    }

    async getIdToAdd(email: string): Promise<string>{
        return this.addFriendsRepository.getUserId(email)
    }

    isSameUser(ids:Ids): boolean{
        return ids.sessionId === ids.requestId
    }

    async isAlreadyAddedToFriendRequests(ids: Ids): Promise<boolean>{
        return this.addFriendsRepository.hasExistingFriendRequest(ids.sessionId, ids.requestId)
    }

    async userExists(email: string ): Promise<boolean>{
        return this.addFriendsRepository.userExists(email)
    }
}
