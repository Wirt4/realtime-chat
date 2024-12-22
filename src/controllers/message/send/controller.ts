import {AbstractController} from "@/controllers/abstractController";
import {MessageSendInterface} from "@/services/message/interface";
import {FriendsRepository} from "@/repositories/friends/repository";
import {MessageRepository} from "@/repositories/message/respository";


export class Controller extends AbstractController{
    private readonly friendsRepository: FriendsRepository
    private readonly messageRepository: MessageRepository

    constructor(props) {
        super(props);
        this.friendsRepository = new FriendsRepository();
        this.messageRepository = new MessageRepository();
    }

    async send(request: Request, service: MessageSendInterface): Promise<Response>{
        const sessionUser = await this.getUserId()

        if (!sessionUser){
            return this.unauthorized()
        }
        const body = await request.json()
        const chatId = body.chatId
        const areFriends = await service.areFriends(sessionUser, chatId, this.friendsRepository)
        const isChatMember = service.isChatMember(sessionUser, chatId)

        if (!(isChatMember && areFriends)){
            return this.unauthorized()
        }

        const chatProfile: ChatProfile = {id: chatId, sender: sessionUser}

        try{
            await service.sendMessage(chatProfile, body.text, this.messageRepository)
        }catch(error){
            return this.respond(error.toString(), 500)
        }

        return this.ok()
    }
}
