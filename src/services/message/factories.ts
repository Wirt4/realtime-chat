import { getPusherServer } from "@/lib/pusher";
import { ServicePusher } from "../pusher/service";
import { MessageRepositoryFacade } from "./repositoryFacade";
import { ChatProfileRepository } from "@/repositories/chatProfile/implementation";
import { db } from "@/lib/db";
import { SendMessageRepository } from "@/repositories/message/send/implementation";
import { FriendsRepository } from "@/repositories/friends/friendsImplementation";
import { GetMessagesRepository } from "@/repositories/message/get/implementation";
import { MessageRepository } from "@/repositories/message/removeAll/implementation";
import { Message } from "@/lib/validations/messages";

export function messageRepositoryFactory(): MessageRepositoryFacade {
    return new RepoFacade();
}

class RepoFacade implements MessageRepositoryFacade {
    private profileRepo: ChatProfileRepository;
    private sendRepo: SendMessageRepository;
    private friendsRepo: FriendsRepository;
    private getMessageRepo: GetMessagesRepository;
    private removeMessageRepo: MessageRepository;

    constructor() {
        this.profileRepo = new ChatProfileRepository(db)
        this.sendRepo = new SendMessageRepository(db)
        this.friendsRepo = new FriendsRepository(db)
        this.getMessageRepo = new GetMessagesRepository()
        this.removeMessageRepo = new MessageRepository(db)
    }

    getChatProfile(id: string): Promise<ChatProfile> {
        return this.profileRepo.getChatProfile(id);
    }

    friendshipExists(userId: string, friendId: string): Promise<boolean> {
        return this.friendsRepo.exists(userId, friendId);
    }

    sendMessage(chatId: string, msg: Message): Promise<void> {
        return this.sendRepo.sendMessage(chatId, msg);
    }

    removeAllMessages(chatId: string): Promise<number> {
        return this.removeMessageRepo.removeAllMessages(chatId);
    }

    getMessages(id: string): Promise<Message[]> {
        return this.getMessageRepo.getMessages(id);
    }
}
export function messagePusherFactory(): ServicePusher {
    return new ServicePusher(getPusherServer())
}
