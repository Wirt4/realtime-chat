import { AbstractFriendsController } from "@/controllers/friends/abstract";
import { aAddFriendService } from "@/services/friends/add/abstract";


export class AddFriendsController extends AbstractFriendsController {
    async addFriendRequest(request: Request, service: aAddFriendService): Promise<Response> {
        const body = await request.json();
        const email = body.email;

        try {
            const idToAdd = await service.getIdToAdd(email);
            const userId = await this.getUserId();
            if (!userId) {
                return this.unauthorized();
            }

            await Promise.all([
                service.storeFriendRequest({ requestId: idToAdd, sessionId: userId.toString() }),
                service.triggerEvent({ requestId: idToAdd, sessionId: userId.toString() }, email)
            ]);

            return this.respond('Friend added successfully', 200);
        } catch (error) {
            if (typeof error === 'string') {
                return this.respond(error, 400);
            } else if (error instanceof Error) {
                return this.respond(error.message, 400);
            } else {
                console.error({ error });
                return this.respond('An error occurred, check logs', 500);
            }
        }
    }
}
