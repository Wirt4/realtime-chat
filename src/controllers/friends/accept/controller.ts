import {AbstractFriendsController} from "@/controllers/friends/abstract";
import {friendSchema} from "@/schemas/friendSchema";
import {FriendRequestStatus} from "@/enums";
import {IAcceptFriendsService} from "@/services/friends/acceptFriends/interface";

export class AcceptFriendsController extends AbstractFriendsController{
    async acceptFriendRequest(request: Request, service: IAcceptFriendsService):Promise<Response> {
        const idToAdd = await this.getIdToAdd(request);

        if (!idToAdd) {
            return this.respond('Invalid ID', 422)
        }

        const userId =  await this.getUserId();

        if (!userId) {
            return this.unauthorized()
        }

        const ids:Ids = {sessionId: userId as string, requestId: idToAdd as string}

        try{
            await this.handle(ids, service);
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

    async handle(ids: Ids, service: IAcceptFriendsService): Promise<void> {
        return  service.handleFriendRequest(ids);
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
