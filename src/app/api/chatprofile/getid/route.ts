/**
 * /api/chatprofile/getid:
 *   post:
 *     summary: fetch a chat id by participant user ids
 *     description: fetch a chat id by participant user ids
 *     tags:
 *       - Chatprofile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               participants:
 *                 type: string
 *                 description: The IDs of the users who share the same chat.
 *     responses:
 *       200:
 *         description: Successfully removed the friend.
 *         content:
 *          application/json:
 *           schema:
 *            type: object
 *           properties:
 *            chatId:
 *              type: string
 *              description: The ID of the chat with all participants, returns empty string if such a chat does not exist.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Internal server error.
 */

export async function POST(request: Request): Promise<Response> {
    // create a controller
    // return controller.getChatIdFromUsers(request)
    return Response.json({});
}
