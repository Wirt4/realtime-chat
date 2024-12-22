export interface MessageSendInterface{
    isChatMember(userId: string, chatId:string): boolean
    areFriends(userId: string, chatId: string): Promise<boolean>
}