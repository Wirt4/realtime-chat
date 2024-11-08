import {getPusherClient} from "@/lib/pusher";

export default class PusherClientHandler{
    subscribeToPusher(){
        const client = getPusherClient();
        client.subscribe('stub')
    }
}
