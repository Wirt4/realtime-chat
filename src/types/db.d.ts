interface User {
    name: string
    email: string
    image: string
    id: string
}

interface Message{
    senderId: string,
    recieverId: string,
    text: string,
    timestamp: number
}
