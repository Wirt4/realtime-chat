import PusherServer from "pusher";
import PusherClient from "pusher-js";

const cluster = 'us3'

export function getPusherServer(){
    return new PusherServer({
        appId: process.env.PUSHER_APP_ID as string,
        key: process.env.PUSHER_KEY as string,
        secret: process.env.PUSHER_SECRET as string,
        cluster,
        useTLS: true
    })
}

export function getPusherClient(){
    return new PusherClient(getPusherCredentials().pusherKey, {cluster})
}

function getPusherCredentials(){
    const pusherKey  = process.env.NEXT_PUBLIC_PUSHER_CLIENT_KEY

    if (!pusherKey || pusherKey.length === 0) {
        throw new Error('Missing NEXT_PUBLIC_PUSHER_CLIENT_KEY')
    }

    return {pusherKey}
}
