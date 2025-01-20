import { FriendsRepository } from '@/repositories/friends/implementation';
import { Redis } from '@upstash/redis';

describe('FriendRepository.get', () => {
    let expected: string[];
    let mockDB: Redis;
    let repo: FriendsRepository;
    let actual: string[];

    beforeEach(() => {
        jest.resetAllMocks();
        mockDB = { smembers: jest.fn().mockResolvedValue(expected) } as unknown as Redis;
        repo = new FriendsRepository(mockDB);
    })

    it('should return an empty array', async () => {
        expected = ['friend1', 'friend2'];
        mockDB.smembers = jest.fn().mockResolvedValue(expected);
        repo = new FriendsRepository(mockDB);
        actual = await repo.get('foo');
        expect(actual).toEqual(expected);
    });

    it('should return an empty array', async () => {
        expected = [];
        mockDB.smembers = jest.fn().mockResolvedValue(expected);
        repo = new FriendsRepository(mockDB);
        actual = await repo.get('foo');
        expect(actual).toEqual(expected);
    });

    it('confirm query passed to smembers', async () => {
        await repo.get('foo');
        expect(mockDB.smembers).toHaveBeenCalledWith('user:foo:friends');
    });
});

describe('FriendRepository.add', () => {
    let mockDB: Redis;
    let repo: FriendsRepository;

    beforeEach(() => {
        jest.resetAllMocks();
        mockDB = { sadd: jest.fn() } as unknown as Redis;
        repo = new FriendsRepository(mockDB);
    })

    it('should add a friend', async () => {
        await repo.add('foo', 'bar');
        expect(mockDB.sadd).toHaveBeenCalledWith('user:foo:friends', 'bar');
    });
});

describe('FriendRepository.exists', () => {
    it('should return true', async () => {
        const mockDB = { sismember: jest.fn().mockReturnValueOnce(1) } as unknown as Redis;
        const repo = new FriendsRepository(mockDB);
        const actual = await repo.exists('foo', 'bar');
        expect(actual).toBe(true);
    });
});

describe('FriendRepository.remove', () => {
    it('should remove a friend', async () => {
        const mockDB = { srem: jest.fn() } as unknown as Redis;
        const repo = new FriendsRepository(mockDB);
        await repo.remove('foo', 'bar');
        expect(mockDB.srem).toHaveBeenCalledWith('user:foo:friends', 'bar');
    });
});
