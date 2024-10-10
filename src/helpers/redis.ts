type Command = 'zrange' | 'sismember'
const fetchRedis= async (cmd: Command, ...args:string[])=>{
    const opts= {
        headers: {
            Authorization: `Bearer ${process.env.REDIS_TOKEN}`,
        },
        cache: 'no-store',
    }
    const response = await fetch(`${process.env.REDIS_URL}/${cmd}/${ formatArr(args).join('/')}`,opts )

    if (!response.ok) {
        throw new Error(`error executing Redis command: ${response.statusText}`)
    }
        const data = await response.json()
        return data.result
}

const formatArr= (args:any)=>{
    const arr = Object.values(args)
    return arr.length ===0 || typeof arr[0] =='string' ? arr: arr[0]
}

export default fetchRedis;