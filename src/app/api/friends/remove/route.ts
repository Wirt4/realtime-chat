import { RemoveFriendsController } from "@/controllers/friends/remove/controller";
import { FriendsService } from "@/services/friends/service";
import { FriendsRepository } from "@/repositories/friends/implementation";
import { db } from "@/lib/db";
import { ServicePusher } from "@/services/pusher/service";
import { getPusherServer } from "@/lib/pusher";

export async function POST(request: Request) {
    const controller = new RemoveFriendsController();
    const repo = new FriendsRepository(db);
    const pusher = new ServicePusher(getPusherServer());
    const service = new FriendsService(repo, pusher);
    return controller.remove(request, service);
}

