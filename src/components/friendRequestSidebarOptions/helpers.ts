import {getPusherClient} from "@/lib/pusher";
import QueryBuilder from "@/lib/queryBuilder";
import {Dispatch, SetStateAction} from "react";

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
        const friendsChannelName = QueryBuilder.friendsPusher(this.id)

        const friendsChannel = client.subscribe(friendsChannelName)
        const friendRequestsChannel = client.subscribe(requestsChannelName)

        friendsChannel.bind(QueryBuilder.new_friend, this.decrementCount(setter))
        friendRequestsChannel.bind(QueryBuilder.incoming_friend_requests, this.incrementCount(setter))

        return ()=>{
            friendRequestsChannel.unbind(QueryBuilder.incoming_friend_requests, this.incrementCount(setter))
            client.unsubscribe(requestsChannelName)
        }
    }

    incrementCount(func: Dispatch<SetStateAction<number>>){
        return ()=>{
            func(this.count+1)
        }
    }

    decrementCount(){
        return ()=>{}
    }
}
