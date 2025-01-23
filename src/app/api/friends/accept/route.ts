import { AcceptFriendsController } from "@/controllers/friends/accept/controller";
import { getPusherServer } from "@/lib/pusher";
import { ServicePusher } from "@/services/pusher/service";
import { AcceptFriendsService } from "@/services/friends/accept/implementation";
import { AcceptFriendsFacade } from "@/repositories/acceptFriendsFacade/implementation";
import { db } from "@/lib/db";

export async function POST(request: Request): Promise<Response> {
    const facade = new AcceptFriendsFacade(db);
    const pusherService = new ServicePusher(getPusherServer());
    const service = new AcceptFriendsService(facade, pusherService);
    const controller = new AcceptFriendsController()
    return controller.acceptFriendRequest(request, service)
}
