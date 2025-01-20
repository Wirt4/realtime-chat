import { RemoveFriendsController } from "@/controllers/friends/remove/controller";
import { friendsServiceFactory } from "@/services/friends/factory";

export async function POST(request: Request) {
    const controller = new RemoveFriendsController();
    const service = friendsServiceFactory();
    return controller.remove(request, service);
}

