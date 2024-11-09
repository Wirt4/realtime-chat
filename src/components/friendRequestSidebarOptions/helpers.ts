import {getPusherClient} from "@/lib/pusher";
import QueryBuilder from "@/lib/queryBuilder";
import {Dispatch, SetStateAction} from "react";

export default class PusherClientHandler{
    private readonly id:string
    private readonly count: number;

    constructor(id:string, count: number){
        this.id=id;
        this.count = count;
    }

    subscribeToPusher(setter: Dispatch<SetStateAction<number>>){
        const client = getPusherClient();
        const channel = client.subscribe(QueryBuilder.incomingFriendRequestsPusher(this.id))
        client.subscribe('user__12345__friends')
        channel.bind(QueryBuilder.incoming_friend_requests, this.handleRequest(setter))

        return ()=>{
            channel.unbind(QueryBuilder.incoming_friend_requests, this.handleRequest(setter))
            client.unsubscribe(QueryBuilder.incomingFriendRequestsPusher(this.id))
        }
    }

    handleRequest( func: Dispatch<SetStateAction<number>>){
        return ()=>{
            func(this.count+1)
        }
    }
}
