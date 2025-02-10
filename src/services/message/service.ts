import { MessageRemoveAllInterface, MessageSendInterface } from "@/services/message/interface";
import { nanoid } from "nanoid";
import { PusherSendMessageInterface } from "@/services/pusher/interfaces";
import { aFriendsRepository } from "@/repositories/friends/abstract";
import { aMessageRepository } from "@/repositories/message/removeAll/abstract";
import { aSendMessageRepository } from "@/repositories/message/send/abstract";

export class MessageService implements
    MessageSendInterface,
    MessageRemoveAllInterface {
    isChatMember(chatProfile: SenderHeader): boolean {
        const participants = new Participants(chatProfile.id)
        return participants.isParticipant(chatProfile.sender)
    }

    async areFriends(chatProfile: SenderHeader, friendRepository: aFriendsRepository): Promise<boolean> {
        const participants = new Participants(chatProfile.id)
        return friendRepository.exists(chatProfile.sender, participants.getCorrespondent(chatProfile.sender))
    }

    async sendMessage(chatProfile: SenderHeader, text: string, repository: aSendMessageRepository, pusher: PusherSendMessageInterface): Promise<void> {
        const msg = { id: nanoid(), senderId: chatProfile.sender, text, timestamp: Date.now() }
        await Promise.all([
            repository.sendMessage(chatProfile.id, msg),
            pusher.sendMessage(chatProfile.id, msg)
        ])
    }

    async deleteChat(chatId: string, repository: aMessageRepository): Promise<number> {
        return repository.removeAllMessages(chatId)
    }
}

class Participants {
    private readonly user1: string
    private readonly user2: string
    constructor(chatId: string) {
        const [user1, user2] = chatId.split('--')
        this.user1 = user1
        this.user2 = user2
    }

    isParticipant(userId: string): boolean {
        return userId === this.user1 || userId === this.user2
    }

    getCorrespondent(userId: string): string {
        return userId === this.user1 ? this.user2 : this.user1
    }
}
