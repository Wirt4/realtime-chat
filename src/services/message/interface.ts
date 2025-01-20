import { RemoveAllMessagesRepositoryInterface, SendMessageRepositoryInterface } from "@/repositories/message/interface";
import { PusherSendMessageInterface } from "@/services/pusher/interfaces";
import { aFriendsRepository } from "@/repositories/friends/abstract";

export interface MessageSendInterface extends MessageServiceInterface {
    areFriends(chatProfile: ChatProfile, repository: aFriendsRepository): Promise<boolean>
    sendMessage(chatProfile: ChatProfile, text: string, repository: SendMessageRepositoryInterface, pusher: PusherSendMessageInterface): Promise<void>
}

export interface MessageRemoveAllInterface extends MessageServiceInterface {
    deleteChat(chatId: string, repository: RemoveAllMessagesRepositoryInterface): Promise<number>
}

interface MessageServiceInterface {
    isChatMember(chatProfile: ChatProfile): boolean
}
