import {RemoveFriendsController} from "@/controllers/friends/remove/controller";
import {RemoveFriendService} from "@/services/friends/remove/service";
import {FriendsRepository} from "@/repositories/friends/repository";

export async function POST(request: Request) {
    const controller = new RemoveFriendsController();
    const service = new RemoveFriendService(new FriendsRepository());
    return controller.remove(request, service);
}

