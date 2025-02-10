import { MessageRemoveAllInterface } from "@/services/message/interface";
import { z } from "zod";
import { AbstractMessageController } from "@/controllers/message/abstractController";

export class MessageRemoveAllController extends AbstractMessageController {
    async removeAll(request: Request, service: MessageRemoveAllInterface): Promise<Response> {
        const sessionId = await this.getUserId()
        if (!sessionId) {
            return this.unauthorized()
        }

        const body = await request.json()
        let chatId: string

        try {
            chatId = this.validateChatId(body)
        } catch {
            return this.respond('Invalid Input', 422)
        }

        const chatProfile: SenderHeader = { id: chatId.toString(), sender: sessionId.toString() }

        if (!service.isChatMember(chatProfile)) {
            return this.unauthorized()
        }
        try {
            await service.deleteChat(chatId, this.messageRepository)
        } catch (error) {
            return this.respond(error as string, 500)
        }

        return this.ok()
    }

    private validateChatId(body: object): string {
        const chatId = z.object({ chatId: z.string() }).parse(body).chatId;

        if (!this.validateIdFormat(chatId)) {
            throw new Error('ChatId not in format of *****--****')
        }
        return chatId
    }

    private validateIdFormat(chatId: string): boolean {
        const chatIdRegex = /^[\w-]+--[\w-]+$/;
        const stringSchema = z.string().regex(chatIdRegex, { message: 'Invalid format' });
        stringSchema.safeParse(chatId);
        const parseResult = stringSchema.safeParse(chatId);
        return parseResult.success;
    }
}
