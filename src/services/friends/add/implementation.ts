import { aAddFriendsFacade } from "@/repositories/addFriendsFacade/abstract";
import { aAddFriendService } from "./abstract";
import { PusherAddFriendInterface } from "@/services/pusher/interfaces";

export class AddFriendService extends aAddFriendService {
    private pusher: PusherAddFriendInterface;
    private facade: aAddFriendsFacade;

    constructor(facade: aAddFriendsFacade, pusher: PusherAddFriendInterface) {
        super();
        this.pusher = pusher;
        this.facade = facade;
    }

    async triggerEvent(ids: Ids, senderEmail: string): Promise<void> {
        await this.pusher.addFriendRequest(ids.sessionId, ids.requestId, senderEmail);
    }

    async storeFriendRequest(ids: Ids): Promise<void> {
        await this.facade.store(ids);
    }

    getIdFromEmail(email: string): Promise<string> {
        return this.facade.getUserId(email);
    }

    isSameUser(ids: Ids): boolean {
        return ids.requestId === ids.sessionId;
    }

    areFriends(ids: Ids): Promise<boolean> {
        return this.facade.areFriends(ids);
    }

    userExits(email: string): Promise<boolean> {
        return this.facade.userExists(email);
    }

    hasFriendRequest(ids: Ids): Promise<boolean> {
        return this.facade.hasFriendRequest(ids);
    }

}
