import { z } from "zod";
import { AbstractFriendsController } from "@/controllers/friends/abstract";
import { aRemoveFriendsService } from "@/services/friends/remove/abstact";


export class RemoveFriendsController extends AbstractFriendsController {
    async remove(request: Request, service: aRemoveFriendsService) {
        let friendId: string

        try {
            friendId = z.object({ idToRemove: z.string() }).parse(await request.json()).idToRemove;
        } catch {
            return this.respond("Invalid Format", 422)
        }

        const userId = await this.getUserId()
        if (!userId) {
            return this.unauthorized()
        }

        const ids: Ids = { sessionId: userId.toString(), requestId: friendId }

        try {
            await service.removeFriends(ids)
        } catch (error) {
            return this.respond(error as string, 400)
        }

        return this.ok()
    }
}
