import { aAddFriendsFacade } from "@/repositories/addFriendsFacade/abstract";
import { aAddFriendService } from "./abstract";
import { PusherAddFriendInterface } from "@/services/pusher/interfaces";
import { addFriendValidator } from "@/lib/validations/add-friend";

export class AddFriendService extends aAddFriendService {
    private pusher: PusherAddFriendInterface;
    private facade: aAddFriendsFacade;

    constructor(facade: aAddFriendsFacade, pusher: PusherAddFriendInterface) {
        super();
        this.pusher = pusher;
        this.facade = facade;
    }

    async getIdToAdd(email: string): Promise<string> {
        addFriendValidator.parse({ email });
        if (!await this.facade.userExists(email)) {
            throw new Error("User does not exist");
        }
        return this.facade.getUserId(email);
    }

    async triggerEvent(ids: Ids, senderEmail: string): Promise<void> {
        await this.pusher.addFriendRequest(ids.sessionId, ids.requestId, senderEmail);
    }

    async storeFriendRequest(ids: Ids): Promise<void> {
        if (ids.requestId === ids.sessionId) {
            throw new Error("Users can't add themselves as friends");
        }
        if (await this.facade.hasFriendRequest(ids)) {
            throw new Error("You've already added this user");
        }
        if (await this.facade.areFriends(ids)) {
            throw new Error("You're already friends with this user");
        }
        await this.facade.store(ids);
    }


}
