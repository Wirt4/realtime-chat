import { aAcceptFriendsService } from "./abstract";
import { ServiceInterfacePusherFriendsAccept } from "@/services/pusher/interfaces";
import { aAcceptFriendsFacade } from "@/repositories/acceptFriendsFacade/abstract";

export class AcceptFriendsService extends aAcceptFriendsService {
    private facade: aAcceptFriendsFacade;
    private pusherService: ServiceInterfacePusherFriendsAccept;

    constructor(facade: aAcceptFriendsFacade, pusher: ServiceInterfacePusherFriendsAccept) {
        super()
        this.facade = facade
        this.pusherService = pusher

    }

    async handleRequest(ids: Ids): Promise<void> {
        const areFriends = await this.facade.areFriends(ids)
        if (areFriends) throw 'Already friends';
        const hasExistingFriendRequest = await this.facade.hasExistingFriendRequest(ids);
        if (!hasExistingFriendRequest) throw 'No friend request found';
        const sessionUser = await this.facade.getUser(ids.sessionId);
        const requestUser = await this.facade.getUser(ids.requestId);
        await Promise.all([
            this.facade.addFriend(ids),
            this.facade.addFriend({ requestId: ids.sessionId, sessionId: ids.requestId }),
            this.facade.removeRequest(ids),
            this.pusherService.addFriend(ids.sessionId, requestUser),
            this.pusherService.addFriend(ids.requestId, sessionUser),
        ])
    }
}
