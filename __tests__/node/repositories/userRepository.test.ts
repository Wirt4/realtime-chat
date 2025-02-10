import { UserRepository } from "@/repositories/user/implementation";
import { Redis } from "@upstash/redis";

describe('UserRepository.exists', () => {
    let mockDb: Redis;
    let userRepository: UserRepository;
    let exists: boolean;

    it('exits should resolve to true', async () => {
        mockDb = { get: jest.fn().mockResolvedValueOnce('userId') } as unknown as Redis;
        userRepository = new UserRepository(mockDb);

        exists = await userRepository.exists('example@example.com');

        expect(exists).toBe(true);
    });

    it('exits should resolve to true', async () => {
        mockDb = { get: jest.fn().mockResolvedValueOnce(null) } as unknown as Redis;
        userRepository = new UserRepository(mockDb);

        exists = await userRepository.exists('example@example.com');

        expect(exists).toBe(false);
    });

    it('verify query passed to "database.get"', async () => {
        mockDb = { get: jest.fn() } as unknown as Redis;
        userRepository = new UserRepository(mockDb);

        await userRepository.exists('example@example.com');
        expect(mockDb.get).toHaveBeenCalledWith('user:email:example@example.com');
    });

    it('verify query passed to "database.get"', async () => {
        mockDb = { get: jest.fn() } as unknown as Redis;
        userRepository = new UserRepository(mockDb);

        await userRepository.exists('other@other.org');
        expect(mockDb.get).toHaveBeenCalledWith('user:email:other@other.org');
    });
});

describe('UserRepository.getUser', () => {
    const expected = 'userId';
    const mockDb = { get: jest.fn().mockResolvedValue(expected) } as unknown as Redis;
    it('should return an id', async () => {
        const userRepository = new UserRepository(mockDb);

        const result = await userRepository.getId('user@user.com');

        expect(result).toEqual(expected);
    });

    it('should call "database.get" with the correct query', async () => {
        const userRepository = new UserRepository(mockDb);

        await userRepository.getUser('user@user.com');

        expect(mockDb.get).toHaveBeenCalledWith('user:email:user@user.com');
    });
});

describe('UserRepository.getId', () => {
    const expected: User = {
        id: 'userId',
        email: 'user@user.com',
        name: 'user',
        image: 'user.jpg',
    };
    const mockDb = { get: jest.fn().mockResolvedValue(expected) } as unknown as Redis;
    it('should return a user', async () => {
        const userRepository = new UserRepository(mockDb);

        const result = await userRepository.getUser('userId');

        expect(result).toEqual(expected);
    });

    it('should call "database.get" with the correct query', async () => {
        const userRepository = new UserRepository(mockDb);

        await userRepository.getUser('userId');

        expect(mockDb.get).toHaveBeenCalledWith('user:userId');
    });
});


describe('UserRepository userChats', () => {
    let mockDb: Redis;
    let expected: Set<string>;
    beforeEach(() => {
        expected = new Set(['chat1', 'chat2']);
        mockDb = {
            smembers: jest.fn().mockResolvedValue(expected),
            srem: jest.fn(),
            sadd: jest.fn(),
        } as unknown as Redis;
    })
    it('getUserChats', async () => {
        const userRepository = new UserRepository(mockDb);
        expect(userRepository.getUserChats('userId')).resolves.toEqual(expected);
        expect(mockDb.smembers).toHaveBeenCalledWith('user:userId:chats');
    });
    it('removeUserChat', async () => {
        const userRepository = new UserRepository(mockDb);
        await userRepository.removeUserChat('userId', 'chatId');
        expect(mockDb.srem).toHaveBeenCalledWith('user:userId:chats', 'chatId');
    });
    it('addUserChat', async () => {
        const userRepository = new UserRepository(mockDb);
        await userRepository.addUserChat('userId', 'chatId');
        expect(mockDb.sadd).toHaveBeenCalledWith('user:userId:chats', 'chatId');
    });
})
