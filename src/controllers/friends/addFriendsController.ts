import {AbstractFriendsController} from "@/controllers/friends/abstractFriendsController";
import {addFriendValidator} from "@/lib/validations/add-friend";
import {FriendsService} from "@/services/friends/FriendsService";

export class AddFriendsController extends AbstractFriendsController{

    async addFriendRequest(request: Request, service:FriendsService):Promise<Response> {
        const body = await request.json();
        let email: {email: string};
        try {
            email = {email: body.email}
            addFriendValidator.parse(email)
        } catch {
            return this.respond('Invalid request payload', 422)
        }

        const userExists = await this.service.userExists(body.email, this.repository)
        if (!userExists) {
            return this.respond("User does not exist", 400)
        }

        const idToAdd = await service.getIdToAdd(body.email, this.repository);

        const userId = await this.getUserId();
        if (!userId) {
            return this.unauthorized()
        }

        const ids = {userId: userId as string, toAdd: idToAdd as string}

        if (service.isSameUser(ids)) {
            return this.respond("Users can't add themselves as friends", 400)
        }

        if (await this.service.isAlreadyAddedToFriendRequests(ids, this.repository)) {
            return this.respond("You've already added this user", 400)
        }

        if (await this.service.areAlreadyFriends(ids, this.repository)){
            return this.respond("You're already friends with this user", 400)
        }

        await service.handleFriendAdd(ids, email.email, this.repository, this.pusherService)
        return this.ok()
    }
}
