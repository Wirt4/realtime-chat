import {FriendsService} from "@/services/friends/service";
import {AcceptFriendsController} from "@/controllers/friends/accept/controller";

export async function POST(request: Request):Promise<Response> {
    const service = new FriendsService()
    const controller = new AcceptFriendsController()
    return controller.acceptFriendRequest(request, service)
}
