import {getPusherClient} from "@/lib/pusher";

export default class PusherClientHandler{
    constructor( id:string){}

    subscribeToPusher(){
        const client = getPusherClient();
        client.subscribe("user__12345__incoming_friend_requests")
    }
}
