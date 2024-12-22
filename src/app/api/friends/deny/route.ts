import {DenyFriendsController} from "@/controllers/friends/deny/controller";
import {FriendsService} from "@/services/friends/service";


export async function POST(req: Request) {
    const controller = new DenyFriendsController()
    const service = new FriendsService()
    return controller.deny(req, service)
}

