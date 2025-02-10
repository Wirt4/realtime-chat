
import { PusherSendMessageInterface } from "@/services/pusher/interfaces";
import { aFriendsRepository } from "@/repositories/friends/abstract";
import { aMessageRepository } from "@/repositories/message/removeAll/abstract";
import { aSendMessageRepository } from "@/repositories/message/send/abstract";

export interface MessageSendInterface extends MessageServiceInterface {
    areFriends(chatProfile: SenderHeader, repository: aFriendsRepository): Promise<boolean>
    sendMessage(chatProfile: SenderHeader, text: string, repository: aSendMessageRepository, pusher: PusherSendMessageInterface): Promise<void>
}

export interface MessageRemoveAllInterface extends MessageServiceInterface {
    deleteChat(chatId: string, repository: aMessageRepository): Promise<number>
}

interface MessageServiceInterface {
    isChatMember(chatProfile: SenderHeader): boolean
}
