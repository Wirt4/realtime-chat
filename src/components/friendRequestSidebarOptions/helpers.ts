import {getPusherClient} from "@/lib/pusher";
import QueryBuilder from "@/lib/queryBuilder";
import {Dispatch, SetStateAction} from "react";
import Pusher from "pusher-js";

export default class PusherClientHandler{
    private readonly count: number;
    private readonly id: string;

    constructor(id:string, count: number){
        this.id = id
        this.count = count
    }

    subscribeToPusher(setter: Dispatch<SetStateAction<number>>){
        const client =  getPusherClient()
        const requestsChannelName = QueryBuilder.incomingFriendRequestsPusher(this.id)

        const friendsChannel = client.subscribe(QueryBuilder.friendsPusher(this.id))
        const friendRequestsChannel = client.subscribe(requestsChannelName)

        friendsChannel.bind('stub', ()=>{})
        friendRequestsChannel.bind(QueryBuilder.incoming_friend_requests, this.handleRequest(setter))

        return ()=>{
            friendRequestsChannel.unbind(QueryBuilder.incoming_friend_requests, this.handleRequest(setter))
            client.unsubscribe(requestsChannelName)
        }
    }

    handleRequest( func: Dispatch<SetStateAction<number>>){
        return ()=>{
            func(this.count+1)
        }
    }
}
