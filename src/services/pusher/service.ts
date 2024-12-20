import {PusherAddFriendInterface, ServiceInterfacePusherFriendsAccept} from "@/services/pusher/interface";
import PusherServer from "pusher";
import QueryBuilder from "@/lib/queryBuilder";
import {User} from "next-auth";

export class ServicePusher implements ServiceInterfacePusherFriendsAccept, PusherAddFriendInterface{
    constructor(private pusher: PusherServer) {
    }

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
}
