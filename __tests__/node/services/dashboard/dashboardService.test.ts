import { aDashboardData } from '@/services/dashboard/abstract';
import { DashboardData } from '@/services/dashboard/implementation';
import { DashboardDataInterface } from '@/repositories/friends/interfaces';

jest.mock('next-auth')

describe('DashboardService', () => {
    let dashboardData: aDashboardData;
    let friendRequestsRepository: DashboardDataInterface;
    beforeEach(() => {
        jest.resetAllMocks();
        friendRequestsRepository = {
            getIncomingFriendRequests: jest.fn(),
            getUser: jest.fn(),
            getFriends: jest.fn(),
        }
        dashboardData = new DashboardData(friendRequestsRepository);
    });

    it('getIncomingFriendRequests should return the results of the get function of the FriendRequests repository', async () => {
        jest.spyOn(friendRequestsRepository, 'getIncomingFriendRequests').mockResolvedValue(['friend1', 'friend2']);

        const result = await dashboardData.getIncomingFriendRequests('userId');

        expect(result).toEqual(['friend1', 'friend2']);
    });

    it('getFriends should return the results of the get function of the Friends repository', async () => {
        jest.spyOn(friendRequestsRepository, 'getUser').mockResolvedValue({ id: 'friend1', name: 'frodo', email: 'ringbearer@shire.org', image: 'stub' });
        jest.spyOn(friendRequestsRepository, 'getFriends').mockResolvedValue(['friend1']);
        const result = await dashboardData.getFriendsById('userId');

        expect(result).toEqual([{ id: 'friend1', name: 'frodo', email: 'ringbearer@shire.org', image: 'stub' }]);
    });

    it('getFriends should pass each id from the output of repo.getFriends to repo.getUser', async () => {
        const spy = jest.spyOn(friendRequestsRepository, 'getUser');
        jest.spyOn(friendRequestsRepository, 'getFriends').mockResolvedValue(['friend1', 'friend2']);
        await dashboardData.getFriendsById('userId');
        expect(spy).toHaveBeenCalledWith('friend1');
        expect(spy).toHaveBeenCalledWith('friend2');
    });

    it('replicate previous functionality: getChatId should return the concatenation of all chat participants', async () => {
        const result = await dashboardData.getChatId(['bruce', 'alfred']);
        expect(result).toEqual('alfred--bruce');
    })
});