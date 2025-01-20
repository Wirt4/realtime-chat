import { MessageSendInterface } from "@/services/message/interface";
import { FriendsRepository } from "@/repositories/friends/implementation";
import { ServicePusher } from "@/services/pusher/service";
import { getPusherServer } from "@/lib/pusher";
import { AbstractMessageController } from "@/controllers/message/abstractController";
import { aFriendsRepository } from "@/repositories/friends/abstract";
import { db } from "@/lib/db";


export class MessageSendController extends AbstractMessageController {
    private readonly friendsRepository: aFriendsRepository
    private readonly pusher: ServicePusher

    constructor() {
        super();
        this.friendsRepository = new FriendsRepository(db);
        const pusherServer = getPusherServer()
        this.pusher = new ServicePusher(pusherServer)
    }

    async send(request: Request, service: MessageSendInterface): Promise<Response> {
        const sessionUser = await this.getUserId()

        if (!sessionUser) {
            return this.unauthorized()
        }
        const body = await request.json()
        const chatId = body.chatId
        const chatProfile: ChatProfile = { id: chatId as string, sender: sessionUser as string }

        const areFriends = await service.areFriends(chatProfile, this.friendsRepository)
        const isChatMember = service.isChatMember(chatProfile)

        if (!(isChatMember && areFriends)) {
            return this.unauthorized()
        }


        try {
            await service.sendMessage(chatProfile, body.text, this.messageRepository, this.pusher)
        } catch (error) {
            return this.respond(error as string, 500)
        }

        return this.ok()
    }
}
