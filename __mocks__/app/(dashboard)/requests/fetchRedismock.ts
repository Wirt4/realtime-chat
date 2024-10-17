const users1: {[index: string]:User}  = {
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
    'user:k90123': {
        name: "Michael",
        email: 'michael@correlone.edu',
        image: 'stub',
        id:'k90123'
    }
}

const  users2 : {[index: string]:User}  = {
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


interface mockProps {
    command: Command,
    query: string
}

const mockUsers = (props: mockProps, users: {[index: string]:User} )=>{
    if (props.command === 'smembers'){
        const keys  = Object.keys(users) as string[];
        return  keys.map(key=>{
            return key.split(':')[1];
        });
    }

    return JSON.stringify(users[props.query]);
}

const fetchRedisMock1 = async(command:Command, query:string)=> {
    return mockUsers({command, query}, users1);
}

const fetchRedisMock2 = async(command:Command, query:string)=> {
    return mockUsers({command, query}, users2);
}

export{fetchRedisMock1, fetchRedisMock2};
