import { FriendsService } from "@/services/friends/service";
import { AcceptFriendsController } from "@/controllers/friends/accept/controller";
import { FriendsRepository } from "@/repositories/friends/implementation";
import { db } from "@/lib/db";
import { ServicePusher } from "@/services/pusher/service";
import { getPusherServer } from "@/lib/pusher";

export async function POST(request: Request): Promise<Response> {
    const repo = new FriendsRepository(db);
    const pusher = new ServicePusher(getPusherServer());
    const service = new FriendsService(repo, pusher)

    const controller = new AcceptFriendsController()
    return controller.acceptFriendRequest(request, service)
}
