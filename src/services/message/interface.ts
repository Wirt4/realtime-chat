
import {PusherSendMessageInterface} from "@/services/pusher/interfaces";
import {RemoveAllMessagesRepositoryInterface, SendMessageRepositoryInterface} from "@/repositories/message/interface";
import {ISendMessageRepository} from "@/repositories/friends/interfaces";

export interface MessageSendInterface extends IAbstractMessageService{
    areFriends(chatProfile: ChatProfile, repository: ISendMessageRepository): Promise<boolean>
    sendMessage(chatProfile: ChatProfile, text: string, repository: SendMessageRepositoryInterface, pusher:PusherSendMessageInterface): Promise<void>
}

export interface MessageRemoveAllInterface extends IAbstractMessageService{
    deleteChat(chatId: string, repository: RemoveAllMessagesRepositoryInterface): Promise<number>
}

interface IAbstractMessageService{
    isChatMember(chatProfile: ChatProfile): boolean
}
