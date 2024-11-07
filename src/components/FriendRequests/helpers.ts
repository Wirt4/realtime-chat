import {getPusherClient} from "@/lib/pusher";

export default function subscribeToPusherClient (){
    const pusherClient = getPusherClient();
    pusherClient.subscribe('user:12345:incoming_friend_requests');
}
