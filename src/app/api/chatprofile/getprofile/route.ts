/**
 * /api/chatprofile/getprofile:
 *   get:
 *     summary: fetch a chat id by participant user ids
 *     description: fetch a chat id by participant user ids
 *     tags:
 *       - Chatprofile
 *    parameters:
 *     - in: query
 *     name: chatId
 *     required: true
 *     description: The ID of the chat with all participants, returns null if such a chat does not exist.
 *     responses:
 *       200:
 *         description: Successfully checked for the proilve
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *           properties:
 *            chatProfile:
 *              type: object
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 */
/*
import { ChatProfileController } from "@/controllers/chatProfile/controller";

export async function GET(request: Request): Promise<Response> {
    const controller = new ChatProfileController();
    return controller.getProfile(request);
}
*/
