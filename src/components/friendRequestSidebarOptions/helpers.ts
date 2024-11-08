import {getPusherClient} from "@/lib/pusher";
import QueryBuilder from "@/lib/queryBuilder";

export default class PusherClientHandler{
    constructor(id:string){}

    subscribeToPusher(){
        const client = getPusherClient();
        client.subscribe(QueryBuilder.incomingFriendRequestsPusher("12345"))
    }
}
