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

describe('UserRepository.get', () => {
    it('should return a user', async () => {
        const expected: User = {
            id: 'userId',
            email: 'user@user.com',
            name: 'user',
            image: 'user.jpg',
        };
        const mockDb = { get: jest.fn().mockResolvedValue(JSON.stringify(expected)) } as unknown as Redis;
        const userRepository = new UserRepository(mockDb);

        const result = await userRepository.get('userId');

        expect(result).toEqual(expected);
    });

    it('should call "database.get" with the correct query', async () => {
        const mockDb = { get: jest.fn() } as unknown as Redis;
        const userRepository = new UserRepository(mockDb);

        await userRepository.get('userId');

        expect(mockDb.get).toHaveBeenCalledWith('user:userId');
    });
});
