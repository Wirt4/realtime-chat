import { MessageSendInterface } from "@/services/message/interface";
import { FriendsRepository } from "@/repositories/friends/friendsImplementation";
import { ServicePusher } from "@/services/pusher/service";
import { getPusherServer } from "@/lib/pusher";
import { AbstractMessageController } from "@/controllers/message/abstractController";
import { aFriendsRepository } from "@/repositories/friends/abstract";
import { db } from "@/lib/db";
import { aSendMessageRepository } from "@/repositories/message/send/abstract";
import { SendMessageRepository } from "@/repositories/message/send/implementation";


export class MessageSendController extends AbstractMessageController {
    private readonly friendsRepository: aFriendsRepository
    private readonly pusher: ServicePusher
    private readonly sendMessageRepository: aSendMessageRepository

    constructor() {
        super();
        this.friendsRepository = new FriendsRepository(db);
        const pusherServer = getPusherServer()
        this.pusher = new ServicePusher(pusherServer)
        this.sendMessageRepository = new SendMessageRepository(db)
    }

    async send(request: Request, service: MessageSendInterface): Promise<Response> {
        const sessionUser = await this.getUserId()

        if (!sessionUser) {
            return this.unauthorized()
        }

        const body = await request.json()
        const chatId = body.chatId
        const chatProfile = { id: chatId as string, sender: sessionUser as string }
        const isChatMember = await service.isValidChatMember(chatProfile)

        if (!isChatMember) {
            //old logic for areFriend and isChatmember returning false
            return this.unauthorized()
        }


        try {
            await service.sendMessage(chatProfile, body.text)
        } catch (error) {
            return this.respond(error as string, 500)
        }

        return this.ok()
    }
}
