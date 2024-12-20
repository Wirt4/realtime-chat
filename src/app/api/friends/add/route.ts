import {AddFriendsController} from "@/controllers/friends/add/controller";
import {FriendsService} from "@/services/friends/service";

export async function  POST(req: Request):Promise<Response> {
    const controller = new AddFriendsController()
    const service = new FriendsService()
    return controller.addFriendRequest(req, service)
}
