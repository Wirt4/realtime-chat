import {RemoveFriendsController} from "@/controllers/friends/remove/controller";
import {FriendsService} from "@/services/friends/service";

export async function POST(request: Request) {
    const controller = new RemoveFriendsController();
    const service = new FriendsService();
    return controller.remove(request, service);
}

