import { AcceptFriendsController } from "@/controllers/friends/accept/controller";
import { getPusherServer } from "@/lib/pusher";
import { ServicePusher } from "@/services/pusher/service";
import { AcceptFriendsService } from "@/services/friends/accept/implementation";
import { AcceptFriendsFacade } from "@/repositories/acceptFriendsFacade/implementation";
import { db } from "@/lib/db";
import { ChatProfileService } from "@/services/chatProfile/implementation";
import { ChatProfileRepository } from "@/repositories/chatProfile/implementation";

export async function POST(request: Request): Promise<Response> {
    const facade = new AcceptFriendsFacade(db);

    const pusherService = new ServicePusher(getPusherServer());
    const chatProfileRepository = new ChatProfileRepository(db);
    const chatProfileService = new ChatProfileService(chatProfileRepository);

    const service = new AcceptFriendsService(facade, pusherService, chatProfileService);
    const controller = new AcceptFriendsController()
    return controller.acceptFriendRequest(request, service)
}
