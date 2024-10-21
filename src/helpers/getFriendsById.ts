import fetchRedis from "@/helpers/redis";

const getFriendsById = async(userId:string) => {
    const ids = await fetchRedis('smembers', 'user:1234:friends') as string[];
    if (ids.length === 0) {
        return [];
    }

    return Promise.all(ids.map(async(id) => {
        return await fetchRedis('get', 'user:'+ id) as User;
    }));
}

export default getFriendsById;
