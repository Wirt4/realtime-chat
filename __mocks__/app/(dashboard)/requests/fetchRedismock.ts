const fetchRedisMock1 = async(cmd:string, query:string)=>{
    if (cmd ==='smembers'){
        return['k1234','k5678', 'k90123' ];
    }
    const users: {[index: string]:User}  = {
        'user:k1234': {
            name: "Santino",
            email: 'sonny@correlone.edu',
            image: 'stub',
            id:'k1234'
        },
        'user:k5678':{
            name: "Freddie the Fisher",
            email: 'fredo@correlone.edu',
            image: 'stub',
            id:'k5678'
        },
        'user:k90123':{
            name: "Michael",
            email: 'michael@correlone.edu',
            image: 'stub',
            id:'k90123'
        }
    }
    return JSON.stringify(users[query]);
}

const fetchRedisMock2 = async(cmd:string, query:string)=>{
    if (cmd ==='smembers'){
        return['l1234','l5678' ]
    }
    const users: {[index: string]:User}  = {
        'user:l1234': {
            name: "Clemenza",
            email: 'clemenza@correlone.edu',
            image: 'stub',
            id:'l1234'
        },
        'user:l5678':{
            name: "Tessio",
            email: 'tessio@correlone.edu',
            image: 'stub',
            id:'l5678'
        }
    }
    return JSON.stringify(users[query])
}

export{fetchRedisMock1, fetchRedisMock2};