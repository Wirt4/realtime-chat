import { FriendRequestsRepository } from '@/repositories/friends/requestsImplementation';
import { Redis } from '@upstash/redis';

describe('FriendRequestsRepository.exists', () => {
    let mockDb: Redis;
    let friendRequestsRepository: FriendRequestsRepository;

    beforeEach(() => {
        jest.resetAllMocks();
        mockDb = { sismember: jest.fn() } as unknown as Redis;
        friendRequestsRepository = new FriendRequestsRepository(mockDb);
    });

    it('if sismember returns true, then return true', async () => {
        mockDb.sismember = jest.fn().mockResolvedValue(1);
        const result = await friendRequestsRepository.exists('userId', 'idToAdd');
        expect(result).toBe(true);
    });

    it('if sismember returns false, then return false', async () => {
        mockDb.sismember = jest.fn().mockResolvedValue(0);
        const result = await friendRequestsRepository.exists('userId', 'idToAdd');
        expect(result).toBe(false);
    });

    it('sisismember should be called with correct arguments', async () => {
        mockDb.sismember = jest.fn().mockResolvedValue(0);
        await friendRequestsRepository.exists('userId', 'idToAdd');
        expect(mockDb.sismember).toHaveBeenCalledWith('user:userId:incoming_friend_requests', 'idToAdd');
    });
});

describe('FriendRequestsRepository.add', () => {
    it('should call sadd with correct arguments', async () => {
        const mockDb = { sadd: jest.fn() } as unknown as Redis;
        const friendRequestsRepository = new FriendRequestsRepository(mockDb);
        await friendRequestsRepository.add('userId', 'friendId');
        expect(mockDb.sadd).toHaveBeenCalledWith('user:userId:incoming_friend_requests', 'friendId');
    });
});

describe('FriendRequestsRepository.add', () => {
    it('should call srem with correct arguments', async () => {
        const mockDb = { srem: jest.fn() } as unknown as Redis;
        const friendRequestsRepository = new FriendRequestsRepository(mockDb);
        await friendRequestsRepository.remove('userId', 'friendId');
        expect(mockDb.srem).toHaveBeenCalledWith('user:userId:incoming_friend_requests', 'friendId');
    });
});

describe('FriendRequestsRepository.get', () => {
    it('should return results from database smembers', async () => {
        const expected = ['requestId', 'anotherRequestId']
        const mockDb = { smembers: jest.fn().mockResolvedValue(expected) } as unknown as Redis;
        const friendRequestsRepository = new FriendRequestsRepository(mockDb);
        const result = await friendRequestsRepository.get('userId');
        expect(result).toEqual(expected);
    });
});
