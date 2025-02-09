import { AbstractFriendsController } from "@/controllers/friends/abstract";
import { aAcceptFriendsService } from "@/services/friends/accept/abstract";

export class AcceptFriendsController extends AbstractFriendsController {
    async acceptFriendRequest(request: Request, service: aAcceptFriendsService): Promise<Response> {
        const body = await request.json();
        try {
            const idToAdd = service.getIdToAdd(body);
            const userId = await this.getUserId();
            if (!userId) {
                return this.unauthorized();
            }
            const ids = { sessionId: userId as string, requestId: idToAdd as string };
            await Promise.all([
                service.acceptFriendRequest(ids),
                service.triggerEvent(ids)
            ])

        } catch (error) {
            return this.respond(error as string, 400);
        }
        return this.ok();
    }
}
