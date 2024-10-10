type Command = 'zrange' | 'sismember'
const fetchRedis= async (cmd: Command, ...args:string[])=>{
    await fetch(`${process.env.REDIS_URL}/${cmd}/${ Object.values(args)[0].join('/')}`)
}

export default fetchRedis;

