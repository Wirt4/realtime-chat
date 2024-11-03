import PusherServer from "pusher";

export function getPusherServer(){
    return new PusherServer({
        appId: process.env.PUSHER_APP_ID as string,
        key: process.env.PUSHER_KEY as string,
        secret: process.env.PUSHER_SECRET as string,
        cluster: 'us3',
        useTLS: true
    })
}
