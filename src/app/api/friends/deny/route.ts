import {DenyFriendsController} from "@/controllers/friends/deny/controller";
import {DenyFriendsService} from "@/services/friends/deny/service";
import {FriendsRepository} from "@/repositories/friends/repository";
import {ServicePusher} from "@/services/pusher/service";
import {getPusherServer} from "@/lib/pusher";

export async function POST(req: Request) {
    const controller = new DenyFriendsController()
    const repository = new FriendsRepository()
    const pusher = new ServicePusher(getPusherServer())
    const service = new DenyFriendsService(repository, pusher)
    return controller.deny(req, service)
}

