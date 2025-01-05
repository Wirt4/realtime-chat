import {IAcceptFriendPusher} from "@/services/pusher/interfaces";
import {IAcceptFriendsRepository} from "@/repositories/friends/interfaces";
import {IAcceptFriendsService} from "@/services/friends/acceptFriends/interface";
import {FriendRequestStatus} from "@/enums";

export class AcceptFriendsService implements IAcceptFriendsService {
    private repository: IAcceptFriendsRepository;
    private pusher: IAcceptFriendPusher

    constructor(repository: IAcceptFriendsRepository, pusher: IAcceptFriendPusher) {
        this.repository = repository
        this.pusher = pusher
    }

    async handleFriendRequest(ids: Ids): Promise<void>{
        await this.checkForErrors(ids)
        const {toAdd, user} = await this.getUsers(ids)

        await Promise.all([
            this.mutualAddFriends(ids),
            this.removeFriendRequest(ids),
            this.triggerAddFriendPusher(ids, user, toAdd)
        ])
    }

    private async getUsers(ids: Ids): Promise<{toAdd: User, user: User}>{
        const toAdd = await this.repository.getUser(ids.requestId)
        const user = await this.repository.getUser(ids.sessionId)
        return {toAdd, user}
    }

    private async mutualAddFriends(ids: Ids): Promise<void>{
        await Promise.all([
            this.repository.addToFriends(ids.requestId, ids.sessionId),
            this.repository.addToFriends(ids.sessionId, ids.requestId)
        ])
    }

    private async removeFriendRequest(ids: Ids): Promise<void>{
        await  this.repository.removeFriendRequest(ids.sessionId, ids.requestId)
    }

    private async triggerAddFriendPusher(ids: Ids, user:User, toAdd: User): Promise<void>{
       await Promise.all([
           this.pusher.addFriend(ids.requestId, user),
           this.pusher.addFriend(ids.sessionId, toAdd),
       ])
    }

    private async checkForErrors(ids: Ids): Promise<void>{
        if (await this.repository.areFriends(ids.sessionId, ids.requestId)) {
            throw FriendRequestStatus.AlreadyFriends
        }

        if (!await this.repository.hasExistingFriendRequest(ids.sessionId, ids.requestId)) {
            throw FriendRequestStatus.NoExistingFriendRequest
        }
    }
}
