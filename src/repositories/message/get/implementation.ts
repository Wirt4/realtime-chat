import { Database } from "@/lib/interfaces/database";
import { aGetMessagesRepository } from "./abstract";
import { getMessageRepositoryFactory } from "./factory";
import { messageArraySchema } from "@/lib/validations/messages";

export class GetMessagesRepository extends aGetMessagesRepository {
    private db: Database;
    constructor() {
        super();
        this.db = getMessageRepositoryFactory();
    }

    async getMessages(chatId: string): Promise<{
        id: string,
        senderId: string,
        text: string,
        timestamp: number
    }[]> {
        const rawData = await this.db.zrange(`chat:${chatId}:messages`, 0, -1);
        if (rawData?.length === 0) return []
        try {
            return messageArraySchema.parse(rawData);
        } catch {
            throw new Error('database returned invalid message format');
        }
    }
}
