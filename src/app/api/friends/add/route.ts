import { AddFriendsController } from "@/controllers/friends/add/controller";
import { AddFriendService } from "@/services/friends/add/implementation";
import { AddFriendsFacade } from "@/repositories/addFriendsFacade/implementation";
import { ServicePusher } from "@/services/pusher/service";
import { getPusherServer } from "@/lib/pusher";
import { db } from "@/lib/db";


export async function POST(req: Request): Promise<Response> {
    const controller = new AddFriendsController();
    const facade = new AddFriendsFacade(db);
    const pusher = new ServicePusher(getPusherServer());
    const service = new AddFriendService(facade, pusher);
    return controller.addFriendRequest(req, service)
}
