export interface MessageRepositoryFacade {
    getChatProfile: (id: string) => Promise<any>
    ProfileExists: (members: string[]) => Promise<boolean>,
    sendMessage: (id: string, msg: any) => Promise<void>,
    getMessage: (id: string) => Promise<any>,
    removeAllMessages: (id: string) => Promise<number>,
    getMessages: (id: string) => Promise<any>
}
