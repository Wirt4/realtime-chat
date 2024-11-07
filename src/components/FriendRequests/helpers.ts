import {getPusherClient} from "@/lib/pusher";
import QueryBuilder from "@/lib/queryBuilder";
import PusherClient from "pusher-js";

export default class PusherClientHandler{
    private readonly _sessionId: string
    private _pusherClient: PusherClient;
    private readonly _subscribeQuery: string;
    private readonly _bindField: string;

    constructor(sessionId:string){
        this._sessionId = sessionId
        this._pusherClient = getPusherClient()
        this._subscribeQuery = QueryBuilder.incomingFriendRequests(this._sessionId).replace(/:/g, '__')
        this._bindField = 'incoming_friend_requests'
    }

    subscribeToPusherClient (){
        this._pusherClient.subscribe(this._subscribeQuery);
        this._pusherClient.bind(this._bindField, this.friendRequestHandler)
        return this.tearDown
    }

    friendRequestHandler(){}

    tearDown(){
        this._pusherClient.unsubscribe(this._subscribeQuery);
        this._pusherClient.unbind(this._bindField);
    }
}
