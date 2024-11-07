import {getPusherClient} from "@/lib/pusher";
import QueryBuilder from "@/lib/queryBuilder";
import PusherClient from "pusher-js";
import {Dispatch, SetStateAction} from "react";

export default class PusherClientHandler{
    private readonly _sessionId: string
    private _pusherClient: PusherClient;
    private readonly _subscribeQuery: string;
    private readonly _bindField: string;
    private readonly _setFriendRequests: Dispatch<SetStateAction<FriendRequest[]>>;

    constructor(sessionId:string, setFriendRequests: Dispatch<SetStateAction<FriendRequest[]>>){
        this._sessionId = sessionId
        this._pusherClient = getPusherClient()
        this._subscribeQuery = QueryBuilder.incomingFriendRequestsPusher(this._sessionId)
        this._bindField = QueryBuilder.incoming_friend_requests
        this._setFriendRequests = setFriendRequests
    }

    subscribeToPusherClient (){
        this._pusherClient.subscribe(this._subscribeQuery);
        this._pusherClient.bind(this._bindField, this.friendRequestHandler)
        return this.tearDown
    }

    friendRequestHandler(){
        this._setFriendRequests([{senderId:'foo', senderEmail:'bar'}])
    }

    tearDown(){
        this._pusherClient.unsubscribe(this._subscribeQuery);
        this._pusherClient.unbind(this._bindField);
    }
}
