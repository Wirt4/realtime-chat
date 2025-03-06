export abstract class aGetMessagesRepository {
    abstract getMessages(chatId: string): Promise<{
        id: string,
        senderId: string,
        text: string,
        timestamp: number
    }[]>
}
