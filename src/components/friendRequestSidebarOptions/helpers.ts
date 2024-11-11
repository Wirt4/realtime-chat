import {getPusherClient} from "@/lib/pusher";
import QueryBuilder from "@/lib/queryBuilder";
import {Dispatch, SetStateAction} from "react";
import PusherClient, {Channel} from "pusher-js";

export default class PusherClientHandler{
    private readonly count: number
    private readonly id: string
    private readonly client: PusherClient
    private readonly channelNames: {requests:string, friends: string}
    private channels: { requests: Channel, friends: Channel } | undefined

    constructor(id:string, count: number){
        this.id = id
        this.count = count
        this.client = getPusherClient()

        this.channelNames = {
            requests:  QueryBuilder.incomingFriendRequestsPusher(this.id),
            friends: QueryBuilder.friendsPusher(this.id)
        }
    }

    subscribeToPusher(setter: Dispatch<SetStateAction<number>>){
        this.subscribeToAllChannels()
        this.bindAllChannels(setter)

        return ()=>{
            this.unbindAllChannels(setter)
            this.unsubscribeFromAllChannels()
        }
    }

    subscribeToAllChannels(){
        this.channels={
            friends: this.client.subscribe(this.channelNames.friends),
            requests: this.client.subscribe(this.channelNames.requests)
        }
    }

    unsubscribeFromAllChannels(){
        this.client.unsubscribe(this.channelNames.friends)
        this.client.unsubscribe(this.channelNames.requests)
    }

    bindAllChannels(func: Dispatch<SetStateAction<number>>){
        if (this.channels){
            this.channels.friends.bind(QueryBuilder.new_friend, this.decrementCount(func))
            this.channels.requests.bind(QueryBuilder.deny_friend, this.decrementCount(func))
            this.channels.requests.bind(QueryBuilder.incoming_friend_requests, this.incrementCount(func))
        }
    }

    unbindAllChannels(func: Dispatch<SetStateAction<number>>){
        if (this.channels){
            this.channels.friends.unbind(QueryBuilder.new_friend, this.decrementCount(func))
            this.channels.requests.unbind(QueryBuilder.deny_friend, this.decrementCount(func))
            this.channels.requests.unbind(QueryBuilder.incoming_friend_requests, this.incrementCount(func))
        }
    }

    incrementCount(func: Dispatch<SetStateAction<number>>){
        return ()=>{
            func(this.count + 1)
        }
    }

    decrementCount(func: Dispatch<SetStateAction<number>>){
        if (this.count > 0){
            return ()=>{
                func(this.count - 1)
            }
        }

        return ()=>{}
    }
}
