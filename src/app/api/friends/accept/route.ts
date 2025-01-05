import {AcceptFriendsController} from "@/controllers/friends/accept/controller";
import {AcceptFriendsService} from "@/services/friends/acceptFriends/service";
import {FriendsRepository} from "@/repositories/friends/repository";
import {ServicePusher} from "@/services/pusher/service";
import {getPusherServer} from "@/lib/pusher";

export async function POST(request: Request):Promise<Response> {
    const service = new AcceptFriendsService( new FriendsRepository(), new ServicePusher(getPusherServer()))
    const controller = new AcceptFriendsController()
    return controller.acceptFriendRequest(request, service)
}
