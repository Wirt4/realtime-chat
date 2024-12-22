import {FriendsAbstractInterface} from "@/repositories/friends/interfaces";
import {RemoveAllMessagesRepositoryInterface, SendMessageRepositoryInterface} from "@/repositories/message/interface";
import {PusherSendMessageInterface} from "@/services/pusher/interfaces";

export interface MessageSendInterface extends MessageServiceInterface{
    areFriends(chatProfile: ChatProfile, repository: FriendsAbstractInterface): Promise<boolean>
    sendMessage(chatProfile: ChatProfile, text: string, repository: SendMessageRepositoryInterface, pusher:PusherSendMessageInterface): Promise<void>
}

export interface MessageRemoveAllInterface extends MessageServiceInterface{
    deleteChat(chatId: string, repository: RemoveAllMessagesRepositoryInterface): Promise<void>
}

interface MessageServiceInterface{
    isChatMember(chatProfile: ChatProfile): boolean
}
