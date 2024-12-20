import {AbstractFriendsController} from "@/controllers/friends/abstractFriendsController";
import {ServiceFriendsAdd} from "@/services/friends/serviceFriendsAdd";

export async function POST(request: Request):Promise<Response> {
    const service = new ServiceFriendsAdd()
    const controller = new AbstractFriendsController(service)
    return controller.acceptFriendRequest(request)
}
