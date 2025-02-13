import { ChatProfileRepository } from "@/repositories/chatProfile/implementation";
import { Redis } from "@upstash/redis";

describe('repository.chatProfile tests', () => {
    let mockDb: Redis;
    let chatProfileRepository: ChatProfileRepository;
    beforeEach(() => {
        mockDb = {
            sadd: jest.fn(),
            exists: jest.fn().mockResolvedValue(1),
        } as unknown as Redis;
        chatProfileRepository = new ChatProfileRepository(mockDb);
    })
    it('createChatProfile should call redis', async () => {
        await chatProfileRepository.createChatProfile('chatId', new Set(['member1', 'member2']));

        expect(mockDb.sadd).toHaveBeenCalledWith('chat:chatId:members', 'member1');
        expect(mockDb.sadd).toHaveBeenCalledWith('chat:chatId:members', 'member2');
    });
    it('getChatProfile should return a set of all participants', async () => {
        const expectedMembers = new Set(['member1', 'member2']);
        mockDb.smembers = jest.fn().mockResolvedValue(Array.from(expectedMembers));
        chatProfileRepository = new ChatProfileRepository(mockDb);

        const actual = await chatProfileRepository.getChatProfile('chatId');

        expect(actual.members).toEqual(expectedMembers);
    });
    it('If there is no existing chat with the id, addChatMember should throw an error', async () => {
        mockDb.exists = jest.fn().mockResolvedValue(0);
        chatProfileRepository = new ChatProfileRepository(mockDb);
        const chatId = 'chatId-not-exist';
        try {
            await chatProfileRepository.addChatMember(chatId, 'userId');
            fail('Should have thrown an error');
        } catch (e: any) {
            expect(e.message).toBe(`Chat ${chatId} not exist`);
        }
    });
    it('If the key exits, then addChatMember should resolve', async () => {
        await chatProfileRepository.addChatMember('stub', 'userId');
    });
    it('sadd should be called with the correct key and value', async () => {
        await chatProfileRepository.addChatMember('chatId', 'userId');

        expect(mockDb.sadd).toHaveBeenCalledWith('chat:chatId:members', 'userId');
    });

    test("If createChatProfile is called with an empty set, then it should still call the database", async () => {
        await chatProfileRepository.createChatProfile("123");
        expect(mockDb.sadd).toHaveBeenCalledTimes(1);
    });
});
