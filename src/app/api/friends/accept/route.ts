import { AcceptFriendsController } from "@/controllers/friends/accept/controller";
import { friendsServiceFactory } from "@/services/friends/factory";

export async function POST(request: Request): Promise<Response> {
    const service = friendsServiceFactory();
    const controller = new AcceptFriendsController()
    return controller.acceptFriendRequest(request, service)
}
