import { MessageService } from "@/services/message/service";
import { MessageRemoveAllController } from "@/controllers/message/remove/all/controller";
import { MessageValidator } from "@/services/message/validator/implementation";


/**
 * /api/message/remove/all:
 *   post:
 *     summary: Remove all messages
 *     description: Removes all messages from the database.
 *     tags:
 *       - Messages
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chatId:
 *                 type: string
 *                 description: The key for the chat that requires all contents be removed.
 *     responses:
 *       200:
 *         description: Successfully removed all messages.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 */

export async function POST(request: Request) {
    const validator = new MessageValidator()
    const service = new MessageService(validator)
    const controller = new MessageRemoveAllController()
    return controller.removeAll(request, service)
}
