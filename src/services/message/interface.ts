import {FriendsAbstractInterface} from "@/repositories/friends/interfaces";
import {SendMessageRepositoryInterface} from "@/repositories/message/interface";

export interface MessageSendInterface{
    isChatMember(chatProfile: ChatProfile): boolean
    areFriends(chatProfile: ChatProfile, repository: FriendsAbstractInterface): Promise<boolean>
    sendMessage(chatProfile: ChatProfile, text: string, repository: SendMessageRepositoryInterface): Promise<void>
}
