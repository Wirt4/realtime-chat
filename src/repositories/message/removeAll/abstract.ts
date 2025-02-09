export abstract class aMessageRepository {
    abstract removeAllMessages(chatId: string): Promise<number>;
}
