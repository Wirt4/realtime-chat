import {getPusherClient} from "@/lib/pusher";
import QueryBuilder from "@/lib/queryBuilder";
import PusherClient from "pusher-js";
import {Dispatch, SetStateAction} from "react";

interface State {
    setFriendRequests: Dispatch<SetStateAction<FriendRequest[]>>,
    existingFriendRequests: FriendRequest[]
}

export default class PusherClientHandler{
    private readonly _sessionId: string
    private _pusherClient: PusherClient;
    private readonly _subscribeQuery: string;
    private readonly _bindField: string;
    private readonly _setFriendRequests: Dispatch<SetStateAction<FriendRequest[]>>;
    private readonly _existingFriendRequests: FriendRequest[]

    constructor(sessionId:string, requestState: State){
        this._sessionId = sessionId
        this._pusherClient = getPusherClient()
        this._subscribeQuery = QueryBuilder.incomingFriendRequestsPusher(this._sessionId)
        this._bindField = QueryBuilder.incoming_friend_requests
        this._setFriendRequests = requestState.setFriendRequests
        this._existingFriendRequests = requestState.existingFriendRequests
    }

    subscribeToPusherClient (f: Dispatch<SetStateAction<FriendRequest[]>>){
        this._pusherClient.subscribe(this._subscribeQuery);
        this._pusherClient.bind(this._bindField, this.friendRequestHandler(f))
        return this.tearDown
    }

    friendRequestHandler(f: Dispatch<SetStateAction<FriendRequest[]>>){
       return (request: FriendRequest)=>{
               f([ ... this._existingFriendRequests, request])
       }

    }

    tearDown(){
        this._pusherClient.unsubscribe(this._subscribeQuery);
        this._pusherClient.unbind(this._bindField);
    }
}
