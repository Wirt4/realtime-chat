import { iDashboardData } from '@/services/dashboard/interface';
import { DashboardData } from '@/services/dashboard/implementation';
import { DashboardDataInterface } from '@/repositories/friends/interfaces';

jest.mock('next-auth')

describe('DashboardService', () => {
    let dashboardData: iDashboardData;
    let friendRequestsRepository: DashboardDataInterface;
    beforeEach(() => {
        jest.resetAllMocks();
        friendRequestsRepository = {
            getIncomingFriendRequests: jest.fn(),
            getFriends: jest.fn()
        }
        dashboardData = new DashboardData(friendRequestsRepository);
    });

    it('getIncomingFriendRequests should return the results of the get function of the FriendRequests repository', async () => {
        jest.spyOn(friendRequestsRepository, 'getIncomingFriendRequests').mockResolvedValue(['friend1', 'friend2']);

        const result = await dashboardData.getIncomingFriendRequests('userId');

        expect(result).toEqual(['friend1', 'friend2']);
    });

    it('getFriends should return the results of the get function of the Friends repository', async () => {
        jest.spyOn(friendRequestsRepository, 'getFriends').mockResolvedValue([{ id: 'friend1', name: 'frodo', email: 'ringbearer@shire.org', image: 'stub' }]);

        const result = await dashboardData.getFriendsById('userId');

        expect(result).toEqual([{ id: 'friend1', name: 'frodo', email: 'ringbearer@shire.org', image: 'stub' }]);
    });
});