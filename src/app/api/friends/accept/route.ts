import {FriendsService} from "@/services/friends/service";
import {AcceptFriendsController} from "@/controllers/friends/acceptFriendsController";

export async function POST(request: Request):Promise<Response> {
    const service = new FriendsService()
    const controller = new AcceptFriendsController(service)
    return controller.acceptFriendRequest(request)
}
