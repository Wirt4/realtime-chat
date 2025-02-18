import { Database } from "@/lib/interfaces/database";
import { aGetMessagesRepository } from "./abstract";
import { getMessageRepositoryFactory } from "./factory";
import QueryBuilder from "@/lib/queryBuilder";

export class GetMessagesRepository extends aGetMessagesRepository {
    private db: Database;
    constructor() {
        super();
        this.db = getMessageRepositoryFactory();
    }
    async getMessages(chatId: string): Promise<Message[]> {
        await this.db.zrange(QueryBuilder.messages(chatId), 0, -1);
        return []
    }
}
