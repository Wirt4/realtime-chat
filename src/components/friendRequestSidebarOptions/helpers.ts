import {getPusherClient} from "@/lib/pusher";
import QueryBuilder from "@/lib/queryBuilder";
import {Dispatch, SetStateAction} from "react";

export default class PusherClientHandler{
    private readonly id:string
    constructor(id:string){
        this.id=id;
    }

    subscribeToPusher(){
        const client = getPusherClient();
        const channel = client.subscribe(QueryBuilder.incomingFriendRequestsPusher(this.id))
        channel.bind(QueryBuilder.incoming_friend_requests, this.handleRequest)
    }

    handleRequest( func: Dispatch<SetStateAction<number>>){
        return ()=>{
            func(2)
        }
    }
}
