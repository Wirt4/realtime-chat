import { SessionData } from "@/services/session/implementation";
import { aSessionData } from "@/services/session/abstract";
import { getServerSession } from 'next-auth';

jest.mock('next-auth');

describe('DashboardService', () => {
    let sessionData: aSessionData;
    beforeEach(() => {
        jest.resetAllMocks();
        sessionData = new SessionData();
    })

    it('if getServerSession resolves to null, then getSession should throw', () => {
        (getServerSession as jest.Mock).mockResolvedValue(null);
        expect(sessionData.getSession()).rejects.toThrow();
    });

    it('if getServerSession resolves to a valid session, then getSession should return that session', () => {
        (getServerSession as jest.Mock).mockResolvedValue({ user: { id: 'valid' } });
        expect(sessionData.getSession()).resolves.toEqual({ user: { id: 'valid' } });
    });
});
