import { aChatProfileRepository } from '@/repositories/chatProfile/abstract';
import { Redis } from '@upstash/redis';

export class ChatProfileRepository extends aChatProfileRepository {
    private database: Redis;

    constructor(redis: Redis) {
        super();
        this.database = redis
    }

    async addChatMember(chatId: string, userId: string): Promise<void> {
        await this.checkChatExist(chatId);
        await this.database.sadd(this.keyAddress(chatId), userId);
    }

    async createChatProfile(chatId: string, members: Set<string> | null = null): Promise<void> {
        if (members == null) {
            await this.database.sadd(this.keyAddress(chatId), '');
            return;
        }
        members.forEach(async (member) => {
            await this.database.sadd(this.keyAddress(chatId), member);
        });
    }

    async getChatProfile(chatId: string): Promise<ChatProfile> {
        await this.checkChatExist(chatId);
        const memberList = await this.database.smembers(this.keyAddress(chatId)) as string[];
        return {
            id: chatId,
            members: new Set(memberList)
        }
    }

    async overWriteChatProfile(profile: ChatProfile): Promise<void> {
        await this.checkChatExist(profile.id);

        if (profile.members.size === 0) {
            await this.database.del(this.keyAddress(profile.id));
            return;
        }

        const dbMembersList = await this.database.smembers(this.keyAddress(profile.id));
        const dbMembers = new Set(dbMembersList);
        const membersToAdd = Array.from(profile.members).filter(member => !dbMembers.has(member));

        membersToAdd.forEach(async (member) => {
            await this.database.sadd(this.keyAddress(profile.id), member);
        });

        const membersToRemove = Array.from(dbMembers).filter(member => !profile.members.has(member));
        membersToRemove.forEach(async (member) => {
            await this.database.srem(this.keyAddress(profile.id), member);
        });
    }

    private keyAddress(chatId: string) {
        return `chat:${chatId}:members`;
    }

    private async checkChatExist(chatId: string): Promise<void> {
        const chatExist = await this.database.exists(this.keyAddress(chatId));
        if (chatExist === 0) {
            throw new Error(`Chat ${chatId} not exist`);
        }
    }
}
