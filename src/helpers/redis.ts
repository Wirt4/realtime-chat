type Command = 'zrange' | 'sismember'
const fetchRedis= async (cmd: Command, ...args:string[])=>{
    const opts= {
        headers: {
            Authorization: `Bearer ${process.env.REDIS_TOKEN}`,
        },
        cache: 'no-store',
    }
    const response = await fetch(`${process.env.REDIS_URL}/${cmd}/${ Object.values(args)[0].join('/')}`,opts )

    if (!response.ok) {
        throw new Error(`error executing Redis command: ${response.statusText}`)
    }
        const data = await response.json()
        return data.result
}

export default fetchRedis;
