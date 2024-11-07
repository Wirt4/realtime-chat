import {getPusherClient} from "@/lib/pusher";
import QueryBuilder from "@/lib/queryBuilder";

export default function subscribeToPusherClient (sessionId: string){
    const pusherClient = getPusherClient();
    pusherClient.subscribe(QueryBuilder.incomingFriendRequests(sessionId).replace(/:/g, '__'));
    pusherClient.bind('incoming_friend_requests', friendRequestHandler)
}

export function friendRequestHandler(){}
