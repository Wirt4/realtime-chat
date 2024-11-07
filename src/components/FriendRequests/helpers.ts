import {getPusherClient} from "@/lib/pusher";
import QueryBuilder from "@/lib/queryBuilder";
import PusherClient from "pusher-js";



export default class PusherClientHandler{
    private readonly _sessionId: string
    private _pusherClient: PusherClient;

    constructor(sessionId:string){
        this._sessionId = sessionId
        this._pusherClient = getPusherClient()
    }

    subscribeToPusherClient (){
        this._pusherClient.subscribe(QueryBuilder.incomingFriendRequests(this._sessionId).replace(/:/g, '__'));
        this._pusherClient.bind('incoming_friend_requests', this.friendRequestHandler)
        return this.tearDown
    }

    friendRequestHandler(){}

    tearDown(){
        this._pusherClient.unsubscribe(QueryBuilder.incomingFriendRequests(this._sessionId).replace(/:/g, '__'));
    }
}
