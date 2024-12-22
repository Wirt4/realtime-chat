import {MessageSendInterface} from "@/services/message/interface";
import {FriendsAbstractInterface} from "@/repositories/friends/interfaces";
import {SendMessageRepositoryInterface} from "@/repositories/message/interface";
import {nanoid} from "nanoid";

export class MessageService implements MessageSendInterface{
    isChatMember(chatProfile:ChatProfile): boolean {
        const participants = new Participants(chatProfile.id)
        return participants.isParticipant(chatProfile.sender)
    }

    async areFriends(chatProfile: ChatProfile, friendRepository: FriendsAbstractInterface ): Promise<boolean> {
        const participants = new Participants(chatProfile.id)
        return friendRepository.areFriends(chatProfile.sender, participants.getCorrespondent(chatProfile.sender))
    }

    async sendMessage(chatProfile: ChatProfile, text: string, repository: SendMessageRepositoryInterface): Promise<void> {
        const msg = {id: nanoid(), senderId: chatProfile.sender, text, timestamp: Date.now()}
        await repository.sendMessage(chatProfile.id, msg)
    }
}

class Participants{
    private readonly user1: string
    private readonly user2: string
    constructor( chatId: string){
        const [user1, user2] = chatId.split('--')
        this.user1 = user1
        this.user2 = user2
    }

    isParticipant(userId:string): boolean{
        return userId === this.user1 || userId === this.user2
    }

    getCorrespondent(userId): string{
        return userId === this.user1 ? this.user2 : this.user1
    }
}
