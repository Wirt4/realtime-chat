import { RemoveFriendsController } from "@/controllers/friends/remove/controller";
import { RemoveFriendsService } from "@/services/friends/remove/implementation";
import { db } from "@/lib/db";
import { FriendsRepository } from "@/repositories/friends/friendsImplementation";
import { UserRepository } from "@/repositories/user/implementation";
import { MessageRepository } from "@/repositories/message/removeAll/implementation";
import { ChatProfileRepository } from "@/repositories/chatProfile/implementation";

/**
 * @swagger
 * /api/friends/remove:
 *   post:
 *     summary: Remove a friend
 *     description: Removes a friend from the user's friend list.
 *     tags:
 *       - Friends
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestId:
 *                 type: string
 *                 description: The ID of the user currently logged as a friend of the session user.
 *               sessionId:
 *                 type: string
 *                 description: The ID of the user making the request.
 *     responses:
 *       200:
 *         description: Successfully removed the friend.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 */
export async function POST(request: Request) {
    const controller = new RemoveFriendsController();
    const friendsRepository = new FriendsRepository(db);
    const userRepository = new UserRepository(db);
    const messageRepository = new MessageRepository(db);
    const chatProfileRepository = new ChatProfileRepository(db);
    const service = new RemoveFriendsService(friendsRepository, userRepository, messageRepository, chatProfileRepository);
    return controller.remove(request, service);
}
