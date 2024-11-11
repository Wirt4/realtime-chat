import { getServerSession } from 'next-auth';
import {POST} from "@/app/api/friends/deny/route";

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}));

describe('error cases', ()=>{
    (getServerSession as jest.Mock).mockResolvedValue(false);
    test('given the server session is falsy when the api is called then it should return a 401', async ()=>{
        const response = await POST();
        expect(response.status).toEqual('401');
        expect(response.body?.toString()).toEqual('Unauthorized');
    });
})
