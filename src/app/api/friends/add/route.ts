import {AddFriendsController} from "@/controllers/friends/add/controller";
import {AddFriendsService} from "@/services/friends/add/service";
import {FriendsRepository} from "@/repositories/friends/repository";
import {ServicePusher} from "@/services/pusher/service";
import {getPusherServer} from "@/lib/pusher";

export async function  POST(req: Request):Promise<Response> {
    const controller = new AddFriendsController()
    const repository = new FriendsRepository()
    const pusher = new ServicePusher(getPusherServer())
    const service = new AddFriendsService(repository, pusher)
    return controller.addFriendRequest(req, service)
}
