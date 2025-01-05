import {
    PusherAddFriendInterface,
    PusherDenyFriendInterface, PusherSendMessageInterface,
    IAcceptFriendPusher
} from "@/services/pusher/interfaces";
import PusherServer from "pusher";
import QueryBuilder from "@/lib/queryBuilder";
import {User} from "next-auth";
import {Message} from "@/lib/validations/messages";

export class ServicePusher implements
    IAcceptFriendPusher,
    PusherAddFriendInterface,
    PusherDenyFriendInterface,
    PusherSendMessageInterface
{
    constructor(private pusher: PusherServer) {}

    async addFriend (idToAdd: string, user: User): Promise<void> {
        const channel = QueryBuilder.friendsPusher(idToAdd)
        await this.pusher.trigger(channel, QueryBuilder.new_friend, user)
    }

    async addFriendRequest(userId: string, idToAdd: string, email: string): Promise<void> {
        const data = {senderId:userId, senderEmail: email}
        const channel = QueryBuilder.incomingFriendRequestsPusher(idToAdd);
        const event = QueryBuilder.incoming_friend_requests;
        await this.pusher.trigger(channel, event, data);
    }

    async denyFriendRequest(userId: string, idToDeny:string): Promise<void> {
        const channel = `user__${userId}__friends`
        await this.pusher.trigger(channel, QueryBuilder.deny_friend, idToDeny)
    }

    async sendMessage(chatId: string, message: Message): Promise<void> {
        await this.pusher.trigger(`chat__${chatId}`, 'incoming_message', message)
    }
}
