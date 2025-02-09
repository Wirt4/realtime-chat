import { RemoveFriendsController } from "@/controllers/friends/remove/controller";
import { RemoveFriendsService } from "@/services/friends/remove/implementation";
import { db } from "@/lib/db";
import { FriendsRepository } from "@/repositories/friends/friendsImplementation";

export async function POST(request: Request) {
    const controller = new RemoveFriendsController();
    const repo = new FriendsRepository(db);
    const service = new RemoveFriendsService(repo);
    return controller.remove(request, service);
}
