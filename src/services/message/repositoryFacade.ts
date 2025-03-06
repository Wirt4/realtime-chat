export interface MessageRepositoryFacade {
    getChatProfile: (id: string) => Promise<ChatProfile>
    friendshipExists: (user1: string, user2: string) => Promise<boolean>,
    sendMessage: (id: string, msg: { id: string, senderId: string, text: string, timestamp: number }) => Promise<void>,
    removeAllMessages: (id: string) => Promise<number>,
    getMessages: (id: string) => Promise<{ id: string, senderId: string, text: string, timestamp: number }[]>
}
