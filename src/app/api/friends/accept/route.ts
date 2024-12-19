import {FriendsController} from "@/controllers/friendsController";
import {FriendsService} from "@/services/friendsService";

export async function POST(request: Request):Promise<Response> {
    const service = new FriendsService()
    const controller = new FriendsController(service)
    return controller.acceptFriendRequest(request)
}
