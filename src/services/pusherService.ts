import {PusherServiceInterface} from "@/services/pusherServiceInterface";
import PusherServer from "pusher";
import QueryBuilder from "@/lib/queryBuilder";

export class PusherService implements PusherServiceInterface{
    constructor(private pusher: PusherServer) {
    }
    async triggerPusher (idToAdd: string, user: any): Promise<void> {
        const channel = QueryBuilder.friendsPusher(idToAdd)
        await this.pusher.trigger(channel, QueryBuilder.new_friend, user)
    }
}
