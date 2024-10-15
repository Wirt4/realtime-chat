import fetchRedis from "@/helpers/redis";

async function getFriendRequests(sessionId:string): Promise<{senderId: string, senderEmail:string}[]> {
   const ids = await fetchRedis('smembers', 'user:1234:incoming_friend_requests') as string[]

    const requests = await Promise.all(
        ids.map(async id => {
            const sender = await fetchRedis('get', `user:${id}`) as User;
            return{
                senderId:id,
                senderEmail:sender.email
            }
        })
    );

    return  requests;
}

export default getFriendRequests;