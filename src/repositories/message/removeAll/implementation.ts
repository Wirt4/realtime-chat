
import { Redis } from "@upstash/redis";
import { db } from "@/lib/db";
import QueryBuilder from "@/lib/queryBuilder";
import { aMessageRepository } from "./abstract";

export class MessageRepository extends aMessageRepository {
    private database: Redis

    constructor(database: Redis = db) {
        super()
        this.database = database
    }

    async removeAllMessages(chatId: string): Promise<number> {
        return this.database.del(QueryBuilder.messages(chatId) as never)
    }
}
