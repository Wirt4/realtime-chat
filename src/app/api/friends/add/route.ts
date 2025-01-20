import { AddFriendsController } from "@/controllers/friends/add/controller";
import { friendsServiceFactory } from "@/services/friends/factory";


export async function POST(req: Request): Promise<Response> {
    const controller = new AddFriendsController();
    const service = friendsServiceFactory();
    return controller.addFriendRequest(req, service)
}
