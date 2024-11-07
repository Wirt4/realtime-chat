import PusherServer from "pusher";
import PusherClient from "pusher-js";

const cluster = 'us3'

export function getPusherServer(){
    const {appId, pusherKey, secret} = getPusherCredentials()
    return new PusherServer({
        appId: appId,
        key: pusherKey,
        secret: secret,
        cluster,
        useTLS: true
    })
}

export function getPusherClient(){
    return new PusherClient(getPusherCredentials().pusherKey, {cluster})
}

function getPusherCredentials(){
    const pusherKey  = process.env.NEXT_PUBLIC_PUSHER_CLIENT_KEY as string


    const appId = process.env.NEXT_PUBLIC_PUSHER_APP_ID as string



    const secret =  process.env.NEXT_PUBLIC_PUSHER_SECRET as string


    return {pusherKey, appId, secret}
}
