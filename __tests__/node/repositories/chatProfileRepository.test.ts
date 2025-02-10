import { ChatProfileRepository } from "@/repositories/chatProfile/implementation";
import { Redis } from "@upstash/redis";

describe('repository.chatProfile tests', () => {
    let mockDb: Redis;
    beforeEach(() => {
        mockDb = { sadd: jest.fn() } as unknown as Redis;
    })
    it('createChatProfile should call redis', async () => {
        const chatProfileRepository = new ChatProfileRepository(mockDb);

        await chatProfileRepository.createChatProfile('chatId', new Set(['member1', 'member2']));

        expect(mockDb.sadd).toHaveBeenCalledWith('chat:chatId:members', 'member1');
        expect(mockDb.sadd).toHaveBeenCalledWith('chat:chatId:members', 'member2');
    });
    it('getChatProfile should return a set of all participants', async () => {
        const expectedMembers = new Set(['member1', 'member2']);
        mockDb.smembers = jest.fn().mockResolvedValue(Array.from(expectedMembers));
        const chatProfileRepository = new ChatProfileRepository(mockDb);

        const actual = await chatProfileRepository.getChatProfile('chatId');

        expect(actual.members).toEqual(expectedMembers);
    });
});
