import {getPusherClient} from "@/lib/pusher";
import QueryBuilder from "@/lib/queryBuilder";

export default class PusherClientHandler{
    private readonly id:string
    constructor(id:string){
        this.id=id;
    }

    subscribeToPusher(){
        const client = getPusherClient();
        const channel = client.subscribe(QueryBuilder.incomingFriendRequestsPusher(this.id))
        channel.bind(QueryBuilder.incoming_friend_requests, ()=>{})
    }

    handleRequest(){}
}
