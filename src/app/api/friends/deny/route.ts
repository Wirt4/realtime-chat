import { DenyFriendsController } from "@/controllers/friends/deny/controller";
import { FriendRequestsRepository } from "@/repositories/friends/requestsImplementation";
import { DenyFriendsService } from "@/services/friends/deny/implementation";
import { db } from "@/lib/db";
import { ServicePusher } from "@/services/pusher/service";
import { getPusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
    const controller = new DenyFriendsController()
    const repository = new FriendRequestsRepository(db);
    const pusher = new ServicePusher(getPusherServer());
    const service = new DenyFriendsService(repository, pusher)
    return controller.deny(req, service)
}

