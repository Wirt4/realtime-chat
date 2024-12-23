import {z} from "zod";
import {AbstractFriendsController} from "@/controllers/friends/abstract";
import {RemoveFriendsServiceInterface} from "@/services/friends/interfaces";

export class RemoveFriendsController extends AbstractFriendsController {
    async remove(request: Request, service: RemoveFriendsServiceInterface) {
        let friendId: string

        try{
           friendId = z.object({idToRemove: z.string()}).parse(await request.json()).idToRemove;
        }catch{
            return this.respond("Invalid Format", 422)
        }

        const userId = await this.getUserId()
        if (!userId) {
            return this.unauthorized()
        }

        const ids:Ids = {sessionId: userId.toString(), requestId: friendId}

        const areFriends = await service.areAlreadyFriends(ids, this.repository)
        if (!areFriends) {
            return this.respond('Not Friends', 400)
        }

        try{
            await service.removeFriends(ids, this.repository)
        }catch(error){
            return this.respond(error as string, 500)
        }

        return this.ok()
    }
}
