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
        channel.bind(QueryBuilder.incoming_friend_requests, this.handleRequest(setter))
        return ()=>{
            channel.unbind("incoming_friend_requests", ()=>{})
        }
    }

    handleRequest( func: Dispatch<SetStateAction<number>>){
        return ()=>{
            func(this.count+1)
        }
    }
}
