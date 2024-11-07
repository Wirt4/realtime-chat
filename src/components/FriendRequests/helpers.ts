import {getPusherClient} from "@/lib/pusher";

export default function subscribeToPusherClient (sessionId: string){
    const pusherClient = getPusherClient();
    pusherClient.subscribe(`user:${sessionId}:incoming_friend_requests`);
}
