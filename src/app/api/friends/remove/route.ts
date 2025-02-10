import { RemoveFriendsController } from "@/controllers/friends/remove/controller";
import { RemoveFriendsService } from "@/services/friends/remove/implementation";
import { db } from "@/lib/db";
import { FriendsRepository } from "@/repositories/friends/friendsImplementation";
import { UserRepository } from "@/repositories/user/implementation";
import { MessageRepository } from "@/repositories/message/removeAll/implementation";
import { ChatProfileRepository } from "@/repositories/chatProfile/implementation";

export async function POST(request: Request) {
    const controller = new RemoveFriendsController();
    const friendsRepository = new FriendsRepository(db);
    const userRepository = new UserRepository(db);
    const messageRepository = new MessageRepository(db);
    const chatProfileRepository = new ChatProfileRepository(db);
    const service = new RemoveFriendsService(friendsRepository, userRepository, messageRepository, chatProfileRepository);
    return controller.remove(request, service);
}
