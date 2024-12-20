import {AbstractFriendsController} from "@/controllers/friends/abstractFriendsController";
import {FriendRequestStatus} from "@/services/friends/serviceFriendsAdd";
import {friendSchema} from "@/schemas/friendSchema";

export class AcceptFriendsController extends AbstractFriendsController{
    async acceptFriendRequest(request: Request):Promise<Response> {
        const idToAdd = await this.getIdToAdd(request);

        if (!idToAdd) {
            return this.respond('Invalid ID', 422)
        }

        const userId =  await this.getUserId();

        if (!userId) {
            return this.unauthorized()
        }

        try{
            await this.handle(userId, idToAdd);
        }catch (error){
            if (this.isKnownError(error as string)) {
                return this.respond(error as string, 400)
            }else{
                return this.respond(error as string, 500)
            }
        }
        return this.ok()
    }

    isKnownError(error: string): boolean {
        return  error === FriendRequestStatus.AlreadyFriends || error == FriendRequestStatus.NoExistingFriendRequest
    }

    async handle(userId: string|boolean, toAdd: string|boolean): Promise<void> {
        const ids = {userId: userId.toString(), toAdd: toAdd.toString()}
        return  this.service.handleFriendRequest(ids, this.repository, this.pusherService);
    }

    async getIdToAdd(request: Request):Promise <string | boolean> {
        const body = await request.json();
        try {
            const { id: idToAdd } = friendSchema.parse(body);
            return idToAdd;
        } catch {
            return false;
        }
    }
}
