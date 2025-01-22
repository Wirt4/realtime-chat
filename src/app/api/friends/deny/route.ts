import { DenyFriendsController } from "@/controllers/friends/deny/controller";
import { friendsServiceFactory } from "@/services/friends/factory";

export async function POST(req: Request) {
    const controller = new DenyFriendsController()
    const service = friendsServiceFactory();
    return controller.deny(req, service)
}

