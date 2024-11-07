import {getPusherClient} from "@/lib/pusher";
import QueryBuilder from "@/lib/queryBuilder";



export default class PusherClientHandler{
    private readonly _sessionId: string

    constructor(sessionId:string){
        this._sessionId = sessionId
    }

    subscribeToPusherClient (){
        const pusherClient = getPusherClient();
        pusherClient.subscribe(QueryBuilder.incomingFriendRequests(this._sessionId).replace(/:/g, '__'));
        pusherClient.bind('incoming_friend_requests', this.friendRequestHandler)
    }
    friendRequestHandler(){}
}
