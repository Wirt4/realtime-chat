import { AbstractFriendsController } from "@/controllers/friends/abstract";
import { friendSchema } from "@/schemas/friendSchema";
import { FriendRequestStatus } from "@/services/friends/service";
import { AcceptFriendsServiceInterface } from "@/services/friends/interfaces";
import { FriendsRepository } from "@/repositories/friends/implementation";
import { db } from "@/lib/db";

export class AcceptFriendsController extends AbstractFriendsController {
    async acceptFriendRequest(request: Request, service: AcceptFriendsServiceInterface): Promise<Response> {
        const idToAdd = await this.getIdToAdd(request);

        if (!idToAdd) {
            return this.respond('Invalid ID', 422)
        }

        const userId = await this.getUserId();

        if (!userId) {
            return this.unauthorized()
        }

        const ids: Ids = { sessionId: userId as string, requestId: idToAdd as string }

        try {
            await this.handle(ids, service);
        } catch (error) {
            if (this.isKnownError(error as string)) {
                return this.respond(error as string, 400)
            } else {
                return this.respond(error as string, 500)
            }
        }
        return this.ok()
    }

    isKnownError(error: string): boolean {
        return error === FriendRequestStatus.AlreadyFriends || error == FriendRequestStatus.NoExistingFriendRequest
    }

    async handle(ids: Ids, service: AcceptFriendsServiceInterface): Promise<void> {
        const repo = new FriendsRepository(db);
        return service.handleFriendRequest(ids, repo, this.pusherService);
    }

    async getIdToAdd(request: Request): Promise<string | boolean> {
        const body = await request.json();
        try {
            const { id: idToAdd } = friendSchema.parse(body);
            return idToAdd;
        } catch {
            return false;
        }
    }
}
