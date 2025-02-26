import { aChatProfileRepository } from '@/repositories/chatProfile/abstract';
import { Redis } from '@upstash/redis';

export class ChatProfileRepository extends aChatProfileRepository {
    private database: Redis;

    constructor(redis: Redis) {
        super();
        this.database = redis
    }

    async addChatMember(chatId: string, userId: string): Promise<void> {
        await this.checkChatExists(chatId);
        await this.database.sadd(this.keyAddress(chatId), userId);
    }

    /**
     * 
     * @param chatId the ID to set the chat profile to
     * @param members non-empty set of string ids
     */
    async createChatProfile(chatId: string, members: Set<string>): Promise<void> {
        this.validateString(chatId, "ChatId must be a non-empty string");
        this.validateSet(members, "members can not be empty");
        members?.forEach(async (member) => {
            await this.database.sadd(this.keyAddress(chatId), member);
        });
    }

    async getChatProfile(chatId: string): Promise<ChatProfile> {
        await this.checkChatExists(chatId);
        const memberList = await this.database.smembers(this.keyAddress(chatId)) as string[];
        const s = new Set<string>();
        memberList.forEach((member) => {
            if (member === '') {
                throw new Error("Members must be non-empty strings");
            }
            s.add(member);
        });
        return {
            id: chatId,
            members: s
        }
    }

    async overWriteChatProfile(profile: ChatProfile): Promise<void> {
        await this.checkChatExists(profile.id);

        if (profile.members.size === 0) {
            await this.database.del(this.keyAddress(profile.id));
            return;
        }

        const dbMembersList = await this.database.smembers(this.keyAddress(profile.id));

        const dbMembers = new Set(dbMembersList);
        const membersToAdd = [...profile.members].filter(x => ![...dbMembers].includes(x))

        const membersToRemove = [...dbMembers].filter(x => ![...profile.members].includes(x));

        await Promise.all([
            this.database.sadd(this.keyAddress(profile.id), membersToAdd),
            this.database.srem(this.keyAddress(profile.id), membersToRemove)
        ]);
    }

    private keyAddress(chatId: string) {
        return `chat:${chatId}:members`;
    }

    private async checkChatExists(chatId: string): Promise<void> {
        const chatExist = await this.database.exists(this.keyAddress(chatId));
        if (chatExist === 0) {
            throw new Error(`Chat ${chatId} not exist`);
        }
    }

    private validateString(s: string, errMessage: string): void {
        if (!s) {
            throw new Error(errMessage);
        }
    }

    private validateSet(s: Set<string>, errMessage: string): void {
        if (!s || s.size === 0) {
            throw new Error(errMessage);
        }
    }
}
