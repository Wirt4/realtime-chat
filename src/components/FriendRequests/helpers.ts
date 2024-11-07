import {getPusherClient} from "@/lib/pusher";

export default function subscribeToPusherClient (){
    const pusherClient = getPusherClient()
    pusherClient.subscribe('stub')
}
