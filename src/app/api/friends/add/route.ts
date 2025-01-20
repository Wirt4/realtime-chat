import { AddFriendsController } from "@/controllers/friends/add/controller";
import { FriendsService } from "@/services/friends/service";
import { db } from "@/lib/db";
import { FriendsRepository } from "@/repositories/friends/implementation";
import { ServicePusher } from "@/services/pusher/service";
import { getPusherServer } from "@/lib/pusher";

export async function POST(req: Request): Promise<Response> {
    const controller = new AddFriendsController();
    const repo = new FriendsRepository(db);
    const pusher = new ServicePusher(getPusherServer());
    const service = new FriendsService(repo, pusher)
    return controller.addFriendRequest(req, service)
}
