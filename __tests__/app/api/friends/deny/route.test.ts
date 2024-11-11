import { getServerSession } from 'next-auth';
import {POST} from "@/app/api/friends/deny/route";

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}));

describe('error cases', ()=>{
    test('given the server session is falsy when the api is called then it should return a 401', async ()=>{
        (getServerSession as jest.Mock).mockResolvedValue(false);
        const response = await POST();
        expect(response.status).toEqual('401');
        expect(response.body?.toString()).toEqual('Unauthorized');
    });

    test('given the server session is falsy when the api is called then it should return a 401', async ()=>{
        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'stub'}});
        const response = await POST();
        expect(response.status).toEqual('401');
        expect(response.body?.toString()).not.toEqual('Unauthorized');
    });

    test('given nothing throws an uncaught error,  when the api is called then it should return a Respone Object', async ()=>{
        const response = await POST();
        const expectedType = new Response('OK')
        expect(typeof response).toEqual(typeof expectedType);
    });
})
