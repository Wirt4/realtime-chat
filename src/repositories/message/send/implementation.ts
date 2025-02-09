import { Message, messageSchema } from "@/lib/validations/messages";
import { Redis } from "@upstash/redis";
import QueryBuilder from "@/lib/queryBuilder";
import { aSendMessageRepository } from "./abstract";

export class SendMessageRepository extends aSendMessageRepository {
    private database: Redis

    constructor(database: Redis) {
        super()
        this.database = database
    }

    async sendMessage(chatId: string, message: Message): Promise<void> {
        await this.database.zadd(QueryBuilder.messages(chatId) as never, this.formatPayload(message) as never)
    }

    private formatPayload(message: Message) {
        const parsedMessage: string = JSON.stringify(messageSchema.parse(message))
        return { score: message.timestamp, member: parsedMessage }
    }
}
