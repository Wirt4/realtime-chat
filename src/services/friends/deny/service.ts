import {IDenyFriendsService} from "@/services/friends/deny/interface";
import { IDenyFriendsRepository} from "@/repositories/friends/interfaces";
import {PusherDenyFriendInterface} from "@/services/pusher/interfaces";

export class DenyFriendsService implements IDenyFriendsService{
    private readonly repository: IDenyFriendsRepository;
    private readonly pusher: PusherDenyFriendInterface;
    constructor( repository: IDenyFriendsRepository, pusher: PusherDenyFriendInterface) {
        this.repository = repository;
        this.pusher = pusher;
    }
    async removeEntry(ids: Ids): Promise<void> {
        try{
            await this.repository.removeEntry(ids)
        }catch{
            throw 'Redis Error'
        }
        try{
            await this.pusher.denyFriendRequest(ids.sessionId, ids.requestId)
        }catch{
            throw 'Pusher Error'
        }
    }
}
