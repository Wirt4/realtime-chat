import { aChatProfileRepository } from '@/repositories/chatProfile/abstract';
import { Redis } from '@upstash/redis';

export class ChatProfileRepository extends aChatProfileRepository {
    private database: Redis;

    constructor(redis: Redis) {
        super();
        this.database = redis
    }

    async addChatMember(chatId: string, userId: string): Promise<void> {
        const chatExist = await this.database.exists(this.keyAddress(chatId));
        console.log("chat exits", chatExist);
        if (chatExist === 0) {
            throw new Error(`Chat ${chatId} not exist`);
        }
        await this.database.sadd(this.keyAddress(chatId), userId);
    }

    async createChatProfile(chatId: string, members: Set<string>): Promise<void> {
        members.forEach(async (member) => {
            await this.database.sadd(this.keyAddress(chatId), member);
        });
    }

    async getChatProfile(chatId: string): Promise<ChatProfile> {
        const memberList = await this.database.smembers(this.keyAddress(chatId)) as string[];
        return {
            id: chatId,
            members: new Set(memberList)
        }
    }
    private keyAddress(chatId: string) {
        return `chat:${chatId}:members`;
    }
}
