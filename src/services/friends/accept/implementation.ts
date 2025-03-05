import { aAcceptFriendsService } from "./abstract";
import { ServiceInterfacePusherFriendsAccept } from "@/services/pusher/interfaces";
import { aAcceptFriendsFacade } from "@/repositories/acceptFriendsFacade/abstract";
import { friendSchema } from "@/schemas/friendSchema";
import { aChatProfileService } from "@/services/chatProfile/abstract";

export class AcceptFriendsService extends aAcceptFriendsService {
    private facade: aAcceptFriendsFacade;
    private pusherService: ServiceInterfacePusherFriendsAccept;
    private chatProfileService: aChatProfileService;

    constructor(facade: aAcceptFriendsFacade, pusher: ServiceInterfacePusherFriendsAccept, chatProfileService: aChatProfileService) {
        super()
        this.facade = facade
        this.pusherService = pusher
        this.chatProfileService = chatProfileService
    };

    getIdToAdd(body: { id: string; }): string {
        const { id: idToAdd } = friendSchema.parse(body);
        return idToAdd;
    };

    async triggerEvent(ids: Ids): Promise<void> {
        const sessionUser = await this.facade.getUser(ids.sessionId);
        const requestUser = await this.facade.getUser(ids.requestId);
        await Promise.all([
            this.pusherService.addFriend(ids.sessionId, requestUser),
            this.pusherService.addFriend(ids.requestId, sessionUser)
        ])
    };

    /**
     * Precondition: a request for a friendship between two separate users.
     * The association does not alreaduy exist
     * 
     * Postcontion: Each user's id is added to the other's friend list
     * The request is removed 
     * A new chat exits between the two users
     * @param ids 
     */
    async acceptFriendRequest(ids: Ids): Promise<void> {
        if (ids.requestId === ids.sessionId) {
            throw new Error("You can't be friends with yourself");
        }
        if (await this.facade.areFriends(ids)) {
            throw new Error('Already friends');
        }
        if (!await this.facade.hasExistingFriendRequest(ids)) {
            throw new Error('No existing friend request');
        }
        await Promise.all([
            this.facade.addFriend({ requestId: ids.requestId, sessionId: ids.sessionId }),
            this.facade.addFriend({ requestId: ids.sessionId, sessionId: ids.requestId }),
            this.facade.removeRequest(ids),
            this.generateNewChat(ids)
        ]);
    };

    async generateNewChat(ids: Ids): Promise<void> {
        const p = new Set([ids.requestId, ids.sessionId]);
        await this.chatProfileService.createChat(p);

        const newChatId = this.chatProfileService.getChatId();
        await Promise.all([
            this.facade.addToUserChats(ids.requestId, newChatId),
            this.facade.addToUserChats(ids.sessionId, newChatId),
            this.chatProfileService.addUserToChat(ids.requestId),
            this.chatProfileService.addUserToChat(ids.sessionId),
        ])
    }
}
