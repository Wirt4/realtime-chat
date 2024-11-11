import {getPusherClient} from "@/lib/pusher";
import QueryBuilder from "@/lib/queryBuilder";
import PusherClient, { Channel } from "pusher-js";
import {Dispatch, SetStateAction} from "react";

export default class PusherClientHandler {
    private readonly _sessionId: string;
    private _pusherClient: PusherClient;
    private readonly _subscribeQuery: string;
    private readonly _bindField: string;
    private readonly _existingFriendRequests: FriendRequest[];

    constructor(sessionId: string, existingFriendRequests: FriendRequest[]) {
        this._sessionId = sessionId;
        this._pusherClient = getPusherClient();
        this._subscribeQuery = QueryBuilder.incomingFriendRequestsPusher(this._sessionId);
        this._bindField = QueryBuilder.incoming_friend_requests;
        this._existingFriendRequests = existingFriendRequests;
    }

    subscribeToPusherClient(f: Dispatch<SetStateAction<FriendRequest[]>>) {
        const channel = this._pusherClient.subscribe(this._subscribeQuery);
        channel.bind(this._bindField, this.friendRequestHandler(f));

        return this.tearDown(channel);
    }

    friendRequestHandler(func: Dispatch<SetStateAction<FriendRequest[]>>) {
        return (request: FriendRequest) => {
            func([...this._existingFriendRequests, request]);
        };

    }

    tearDown(channel: Channel){
        return ()=>{
            channel.unbind(this._bindField);
            this._pusherClient.unsubscribe(this._subscribeQuery);
        }
    }
}
