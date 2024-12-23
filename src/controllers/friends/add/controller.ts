import {AbstractFriendsController} from "@/controllers/friends/abstract";
import {addFriendValidator} from "@/lib/validations/add-friend";
import {AddFriendsServiceInterface} from "@/services/friends/interfaces";

export class AddFriendsController extends AbstractFriendsController{

    async addFriendRequest(request: Request, service:AddFriendsServiceInterface):Promise<Response> {
        const body = await request.json();
        let email: {email: string};
        try {
            email = {email: body.email}
            addFriendValidator.parse(email)
        } catch {
            return this.respond('Invalid request payload', 422)
        }

        const userExists = await service.userExists(body.email, this.repository)
        if (!userExists) {
            return this.respond("User does not exist", 400)
        }

        const idToAdd = await service.getIdToAdd(body.email, this.repository);

        const userId = await this.getUserId();
        if (!userId) {
            return this.unauthorized()
        }

        const ids:Ids = {sessionId: userId as string, requestId: idToAdd as string}

        if (service.isSameUser(ids)) {
            return this.respond("Users can't add themselves as friends", 400)
        }

        if (await service.isAlreadyAddedToFriendRequests(ids, this.repository)) {
            return this.respond("You've already added this user", 400)
        }

        if (await service.areAlreadyFriends(ids, this.repository)){
            return this.respond("You're already friends with this user", 400)
        }

        await service.handleFriendAdd(ids, email.email, this.repository, this.pusherService)
        return this.ok()
    }
}
