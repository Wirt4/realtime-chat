import fetchRedis from "@/helpers/redis";

async function getFriendRequests(sessionId:string): Promise<{senderId: string, senderEmail:string}[]> {
   const ids = await fetchRedis('smembers', `user:${sessionId}:incoming_friend_requests`) as string[]


    const requests = await Promise.all(
        ids.map(async id => {
            const sender = await fetchRedis('get', `user:${id}`) as string;
            const foo =JSON.parse(sender) as User
            console.log(foo)
            return{
                senderId:id,
                senderEmail:foo.email
            }
        })
    );

    return  requests;
}

export default getFriendRequests;