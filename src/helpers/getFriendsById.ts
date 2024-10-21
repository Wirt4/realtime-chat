import fetchRedis from "@/helpers/redis";

const getFriendsById = async(userId:string) => {
    const ids = await fetchRedis('smembers', `${q(userId)}:friends`) as string[];
    if (ids.length === 0) {
        return [];
    }

    return Promise.all(ids.map(async(id) => {
        return await fetchRedis('get', q(id)) as User;
    }));
}

const q =(id:string)=>{
    return `user:${id}`
}

export default getFriendsById;
