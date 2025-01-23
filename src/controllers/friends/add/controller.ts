import { AbstractFriendsController } from "@/controllers/friends/abstract";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { FriendsRepository } from "@/repositories/friends/friendsImplementation";
import { db } from "@/lib/db";
import { aAddFriendService } from "@/services/friends/add/abstract";

export class AddFriendsController extends AbstractFriendsController {

    async addFriendRequest(request: Request, service: aAddFriendService): Promise<Response> {
        const body = await request.json();
        let email: { email: string };
        try {
            email = { email: body.email }
            addFriendValidator.parse(email)
        } catch {
            return this.respond('Invalid request payload', 422)
        }

        const userExists = await service.userExits(body.email);
        if (!userExists) {
            return this.respond("User does not exist", 400)
        }

        const idToAdd = await service.getIdFromEmail(body.email);

        const userId = await this.getUserId();
        if (!userId) {
            return this.unauthorized()
        }

        const ids: Ids = { sessionId: userId as string, requestId: idToAdd as string }

        if (service.isSameUser(ids)) {
            return this.respond("Users can't add themselves as friends", 400)
        }

        if (await service.hasFriendRequest(ids)) {
            return this.respond("You've already added this user", 400)
        }

        if (await service.areFriends(ids)) {
            return this.respond("You're already friends with this user", 400)
        }

        await Promise.all([
            service.storeFriendRequest(ids),
            service.triggerEvent(ids, email.email)
        ]);
        return this.ok()
    }
}
