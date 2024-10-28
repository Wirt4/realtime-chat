import fetchRedis from "@/helpers/redis";
import QueryBuilder from "@/lib/queryBuilder";

async function getFriendRequests(sessionId:string): Promise<{senderId: string, senderEmail:string}[]> {
   const ids = await fetchRedis('smembers', QueryBuilder.incomingFriendRequests(sessionId)) as string[]


    const requests = await Promise.all(
        ids.map(async id => {
            const sender = await fetchRedis('get', QueryBuilder.user(id)) as string;
            const parsed = JSON.parse(sender) as User
            return{
                senderId:id,
                senderEmail:parsed.email
            }
        })
    );

    return  requests;
}

export default getFriendRequests;
