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
    };

    areFriends(ids: Ids): Promise<boolean> {
        return this.facade.areFriends(ids);
    };

    hasExistingRequest(ids: Ids): Promise<boolean> {
        return this.facade.hasExistingFriendRequest(ids);
    };

    async triggerEvent(ids: Ids): Promise<void> {
        const sessionUser = await this.facade.getUser(ids.sessionId);
        const requestUser = await this.facade.getUser(ids.requestId);
        await Promise.all([
            this.pusherService.addFriend(ids.sessionId, requestUser),
            this.pusherService.addFriend(ids.requestId, sessionUser)
        ])
    };

    async store(ids: Ids): Promise<void> {
        await Promise.all([
            this.facade.addFriend(ids),
            this.facade.addFriend({ requestId: ids.sessionId, sessionId: ids.requestId }),
            this.facade.removeRequest(ids)
        ])
    };
}
