import { ChatProfileRepository } from "@/repositories/chatProfile/implementation";
import { Redis } from "@upstash/redis";
import { mock } from "node:test";

describe('repository.chatProfile tests', () => {
    let mockDb: Redis;
    let chatProfileRepository: ChatProfileRepository;
    beforeEach(() => {
        mockDb = {
            sadd: jest.fn(),
            exists: jest.fn().mockResolvedValue(1),
            del: jest.fn(),
            smembers: jest.fn().mockResolvedValue([]),
            srem: jest.fn()
        } as unknown as Redis;
        chatProfileRepository = new ChatProfileRepository(mockDb);
    })
    it('postcondition: createChatProfile should have called database', async () => {
        await chatProfileRepository.createChatProfile('chatId', new Set(['member1', 'member2']));

        expect(mockDb.sadd).toHaveBeenCalledWith('chat:chatId:members', 'member1');
        expect(mockDb.sadd).toHaveBeenCalledWith('chat:chatId:members', 'member2');
        expect(mockDb.sadd).toHaveBeenCalledTimes(2);
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
    it('If there is no existing chat with the id, getChatprofile should throw an arror', async () => {
        mockDb.exists = jest.fn().mockResolvedValue(0);
        chatProfileRepository = new ChatProfileRepository(mockDb);
        const chatId = 'chatId-not-exist';
        try {
            await chatProfileRepository.getChatProfile(chatId);
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
    it('precondition: createChatProfile may not be called with a non-empty string', async () => {
        try {
            await chatProfileRepository.createChatProfile('', new Set(['valid-id']));
        } catch (e) {
            expect(e).toEqual(new Error('ChatId must be a non-empty string'));
        }

    });
    it('precondition: members set may not be empty', async () => {
        try {
            await chatProfileRepository.createChatProfile('valid=-', new Set());
        } catch (e) {
            expect(e).toEqual(new Error('members can not be empty'));
        }

    });
    it('overWriteChatProfile should throw an error if no such chat exists', async () => {
        mockDb.exists = jest.fn().mockResolvedValue(0);
        chatProfileRepository = new ChatProfileRepository(mockDb);
        const chatId = 'chatId-not-exist';
        try {
            await chatProfileRepository.overWriteChatProfile({ id: chatId, members: new Set() });
            fail('Should have thrown an error');
        } catch (e: any) {
            expect(e.message).toBe(`Chat ${chatId} not exist`);
        }
    });

    it('overWriteChatProfile should delete the whole set if the members parameter is empty', async () => {
        chatProfileRepository = new ChatProfileRepository(mockDb);
        const chatId = 'chat-to-delete';

        await chatProfileRepository.overWriteChatProfile({ id: chatId, members: new Set() });

        expect(mockDb.del).toHaveBeenCalledWith('chat:chat-to-delete:members');
    });

    it('overWriteChatProfile should read the existing members of the profile if the set it nonempty', async () => {
        chatProfileRepository = new ChatProfileRepository(mockDb);
        const chatId = 'happy-path';

        await chatProfileRepository.overWriteChatProfile({ id: chatId, members: new Set(["user1", "user2"]) });

        expect(mockDb.del).not.toHaveBeenCalledWith('chat:happy-path:members');
        expect(mockDb.smembers).toHaveBeenCalledWith('chat:happy-path:members');
    });

    it('if the new set contains members the existing db entry does not, then they should be written to the db', async () => {
        mockDb.smembers = jest.fn().mockResolvedValue(['user1']);
        chatProfileRepository = new ChatProfileRepository(mockDb);
        const chatId = 'happy-path';

        await chatProfileRepository.overWriteChatProfile({ id: chatId, members: new Set(["user1", "user2", "user3"]) });

        expect(mockDb.sadd).toHaveBeenCalledWith('chat:happy-path:members', ['user2', 'user3']);
    });

    it('if the db members contain entries the new set does not, then those members should be removed', async () => {
        mockDb.smembers = jest.fn().mockResolvedValue(['user1', 'user2', 'user3']);
        chatProfileRepository = new ChatProfileRepository(mockDb);
        const chatId = 'happy-path';

        await chatProfileRepository.overWriteChatProfile({ id: chatId, members: new Set(["user1"]) });

        expect(mockDb.srem).toHaveBeenCalledWith('chat:happy-path:members', ['user2', 'user3']);
    });

    it('enforce contract: set of members may only contain strings', async () => {
        mockDb.smembers = jest.fn().mockResolvedValue(['user1', 'user2', [], ""]);
        chatProfileRepository = new ChatProfileRepository(mockDb);
        const chatId = 'unhappy-path';

        try {
            await chatProfileRepository.getChatProfile(chatId);
            expect(true).toBe(false);
        } catch (e: any) {
            expect(e.message).toBe('Members must be non-empty strings');
        }
    });

});
