import { FriendRequestsRepository } from '@/repositories/friendRequests/implementation';
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
})
