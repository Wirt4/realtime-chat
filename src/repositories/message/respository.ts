import {RemoveAllMessagesRepositoryInterface, SendMessageRepositoryInterface} from "@/repositories/message/interface";
import {Message, messageSchema} from "@/lib/validations/messages";
import {Redis} from "@upstash/redis";
import {db} from "@/lib/db";
import QueryBuilder from "@/lib/queryBuilder";

export class MessageRepository implements
    SendMessageRepositoryInterface,
    RemoveAllMessagesRepositoryInterface{
    private database: Redis
    constructor(database: Redis = db){
        this.database = database
    }

    async sendMessage(chatId: string, message: Message): Promise<void>{
        await this.database.zadd(QueryBuilder.messages(chatId) as never, this.formatPayload(message) as never)
    }

    private formatPayload(message: Message){
        const parsedMessage: string = JSON.stringify(messageSchema.parse(message))
        return {score: message.timestamp, member: parsedMessage}
    }

    async removeAllMessages(chatId: string): Promise<number>{
        return this.database.del( `chat:${chatId}:messages` as never)
    }
}
