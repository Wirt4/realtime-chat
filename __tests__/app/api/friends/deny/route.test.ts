import { getServerSession } from 'next-auth';
import {POST} from "@/app/api/friends/deny/route";
import {request} from "node:http";

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}));

describe('error cases', ()=>{
    beforeEach(()=>{
        jest.resetAllMocks();
        (getServerSession as jest.Mock).mockResolvedValue(false);
    })
    test('given the server session is falsy when the api is called then it should return a 401', async ()=>{
        const request = new Request('/api/friends/accept', {
            method: 'POST',
            body: JSON.stringify({ id: 'validID' }),
            headers: { 'Content-Type': 'application/json' }
        });
        (getServerSession as jest.Mock).mockResolvedValue(false);
        const response = await POST(request);
        expect(response.status).toEqual(401);
        expect(response.body?.toString()).toEqual('Unauthorized');
    });

    test('given the server session is falsy when the api is called then it should return a 401', async ()=>{
        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'stub'}});
        const request = new Request('/api/friends/accept', {
            method: 'POST',
            body: JSON.stringify({ id: 'validID' }),
            headers: { 'Content-Type': 'application/json' }
        });
        const response = await POST(request);
        expect(response.status).not.toEqual(401);
        expect(response.body?.toString()).not.toEqual('Unauthorized');
    });

    test('given nothing throws an uncaught error, when the api is called then it should return a Response Object', async ()=>{
        const request = new Request('/api/friends/accept', {
            method: 'POST',
            body: JSON.stringify({ id: 'validID' }),
            headers: { 'Content-Type': 'application/json' }
        });
        const response = await POST(request);
        const expectedType = new Response('OK')
        expect(typeof response).toEqual(typeof expectedType);
    });

    test("given the session works but the  parameter isn't formatted correctly, when the api is called, it should return a 422", async()=>{
        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'stub'}});
        const request = new Request('/api/friends/accept', {
            method: 'POST',
            body: 'non-formatted string',
            headers: { 'Content-Type': 'application/json' }
        });
        const response = await POST(request);
        expect(response.status).toEqual(421);
        expect(response.body?.toString()).toEqual('Invalid Request payload');
    })

    test("given the session works and the parameter is formatted correctly, when the api is called, then it won't return a 422", async()=>{
        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'stub'}});
        const request = new Request('/api/friends/accept', {
            method: 'POST',
            body: JSON.stringify({ id: 'validID' }),
            headers: { 'Content-Type': 'application/json' }
        });
        const response = await POST( request);
        expect(response.status).not.toEqual(421);
        expect(response.body?.toString()).not.toEqual('Invalid Request payload');
    })
})
