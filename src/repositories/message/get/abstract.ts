export abstract class aGetMessagesRepository {
    abstract getMessages(chatId: string): Promise<Message[]>
}
