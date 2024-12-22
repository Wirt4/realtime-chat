import {SendMessageRepositoryInterface} from "@/repositories/message/interface";
import {Message, messageSchema} from "@/lib/validations/messages";
import {Redis} from "@upstash/redis";
import {db} from "@/lib/db";
import QueryBuilder from "@/lib/queryBuilder";

export class MessageRepository implements SendMessageRepositoryInterface{
    private database: Redis
    constructor(database: Redis = db){
        this.database = database
    }

    async sendMessage(chatId: string, message: Message): Promise<void>{
        await this.database.zadd(QueryBuilder.messages(chatId) as any, this.formatPayload(message) as any)
    }

    private formatPayload(message: Message){
        const parsedMessage: string = JSON.stringify(messageSchema.parse(message))
        return {score: message.timestamp, member: parsedMessage}
    }
}
