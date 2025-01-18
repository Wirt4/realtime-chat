import { iDashboardData } from '@/services/dashboard/interface';
import { DashboardData } from '@/services/dashboard/implementation';
import { getServerSession } from 'next-auth';
jest.mock('next-auth')

describe('DashboardService', () => {
    let dashboardData: iDashboardData;
    beforeEach(() => {
        jest.resetAllMocks();
        dashboardData = new DashboardData();
    })
    it('if getServerSession resolves to null, then getSession should throw', () => {
        (getServerSession as jest.Mock).mockResolvedValue(null);
        expect(dashboardData.getSession()).rejects.toThrow();
    })
    it('if getServerSession resolves to a valid session, then getSession should return that session', () => {
        (getServerSession as jest.Mock).mockResolvedValue({ user: { id: 'valid' } });
        expect(dashboardData.getSession()).resolves.toEqual({ user: { id: 'valid' } });
    })
})