import {AbstractController} from "@/controllers/abstractController";
import {MessageSendInterface} from "@/services/message/interface";

export class Controller extends AbstractController{
    async send(request: Request, service: MessageSendInterface): Promise<Response>{
        const sessionUser = await this.getUserId()
        if (!sessionUser){
            return this.unauthorized()
        }
        const body = await request.json();
        const userId: string = sessionUser.toString()
        const chatId = body.chatId

        const areFriends = await service.areFriends(userId, chatId)
        if (!(service.isChatMember(userId, chatId) && areFriends)){
            return this.unauthorized()
        }
        try{
            await service.sendMessage(userId, chatId, body.text)
        }catch(error){
            return this.respond(error.toString(), 500)
        }
        return this.ok()
    }
}
