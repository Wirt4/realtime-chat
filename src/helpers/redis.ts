type Command = 'zrange' | 'sismember'
const fetchRedis= async (cmd: Command, ...args:string[])=>{
    const opts= {
        headers: {
            Authorization: `Bearer ${process.env.REDIS_TOKEN}`,
        },
        cache: 'no-store',
    }
    const result = await fetch(`${process.env.REDIS_URL}/${cmd}/${ Object.values(args)[0].join('/')}`,opts )
    console.log({result})
    if (!result.ok) {
        throw new Error(`error executing Redis command: ${result.statusText}`)
    }
}

export default fetchRedis;
