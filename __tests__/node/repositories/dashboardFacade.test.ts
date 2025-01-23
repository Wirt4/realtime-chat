import { DashboardFacade } from "@/repositories/dashboardFacade/implementation";
import { FriendRequestsRepository } from "@/repositories/friends/requestsImplementation";
import { FriendsRepository } from "@/repositories/friends/friendsImplementation";
import { UserRepository } from "@/repositories/user/implementation";
import { Redis } from "@upstash/redis";

jest.mock('@/repositories/user/implementation');
jest.mock('@/repositories/friends/requestsImplementation');
jest.mock('@/repositories/friends/friendsImplementation');

describe('DashboardFacade tests', () => {
    let mockDb: Redis;
    let facade: DashboardFacade

    beforeEach(() => {
        jest.resetAllMocks();
        mockDb = { foo: 'bar' } as unknown as Redis;
        facade = new DashboardFacade(mockDb);
    });

    test('constructor', () => {
        expect(UserRepository as jest.Mock).toHaveBeenCalledWith(mockDb);
        expect(FriendRequestsRepository as jest.Mock).toHaveBeenCalledWith(mockDb);
        expect(FriendsRepository as jest.Mock).toHaveBeenCalledWith(mockDb);

    });

    test('getFriendRequests', async () => {
        const friendRequests = ['foo', 'bar'];
        const userId = 'fizz';
        const getSpy = jest.spyOn(FriendRequestsRepository.prototype, 'get').mockResolvedValue(friendRequests);

        const result = await facade.getFriendRequests(userId);

        expect(result).toEqual(friendRequests);
        expect(getSpy).toHaveBeenCalledWith(userId);
    });

    test('getFriendIds', async () => {
        const friendIds = ['foo', 'bar'];
        const userId = 'fizz';
        const getSpy = jest.spyOn(FriendsRepository.prototype, 'get').mockResolvedValue(friendIds);

        const result = await facade.getFriendIds(userId);

        expect(result).toEqual(friendIds);
        expect(getSpy).toHaveBeenCalledWith(userId);
    });

    test('getUser', async () => {
        const user: User = {
            id: 'foo',
            name: 'bar',
            email: 'fizz',
            image: 'buzz',
        }
        const userId = 'fizz';
        const getSpy = jest.spyOn(UserRepository.prototype, 'getUser').mockResolvedValue(user);

        const result = await facade.getUser(userId);

        expect(result).toEqual(user);
    });
});
