type Command = 'zrange' | 'sismember'
const fetchRedis= async (cmd: Command, ...args:string[])=>{
    const opts= {
        headers: {
            Authorization: `Bearer ${process.env.REDIS_TOKEN}`,
        },
        cache: 'no-store',
    }
    await fetch(`${process.env.REDIS_URL}/${cmd}/${ Object.values(args)[0].join('/')}`,opts )
}

export default fetchRedis;
