import {getPusherClient} from "@/lib/pusher";

export default function subscribeToPusherClient (sessionId: string){
    const pusherClient = getPusherClient();
    pusherClient.subscribe(`user__${sessionId}__incoming_friend_requests`);
}
