import { getServerSession } from 'next-auth';
import {POST} from "@/app/api/friends/deny/route";
import {removeDbEntry} from "@/lib/dbWrapper";
import {getPusherServer} from "@/lib/pusher";

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}));

jest.mock("@/lib/dbWrapper", () => ({
    removeDbEntry: jest.fn(),
}));

jest.mock("@/lib/pusher",()=>({
    getPusherServer: jest.fn()
}));


describe('error cases', ()=>{
    beforeEach(()=>{
        jest.resetAllMocks();
        (getServerSession as jest.Mock).mockResolvedValue(false);
        (removeDbEntry as jest.Mock).mockImplementation(()=>jest.fn());
        (getPusherServer as jest.Mock).mockReturnValue({trigger: jest.fn()});
    })

    test('given the server session is falsy when the api is called then it should return a 401', async ()=>{
        const request = new Request('/api/friends/deny', {
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
        const request = new Request('/api/friends/deny', {
            method: 'POST',
            body: JSON.stringify({ id: 'validID' }),
            headers: { 'Content-Type': 'application/json' }
        });
        const response = await POST(request);
        expect(response.status).not.toEqual(401);
        expect(response.body?.toString()).not.toEqual('Unauthorized');
    });

    test('given nothing throws an uncaught error, when the api is called, ' +
        'then it should return a Response Object', async ()=>{
        const request = new Request('/api/friends/deny', {
            method: 'POST',
            body: JSON.stringify({ id: 'validID' }),
            headers: { 'Content-Type': 'application/json' }
        });
        const response = await POST(request);
        const expectedType = new Response('OK')
        expect(typeof response).toEqual(typeof expectedType);
    });

    test("given the session works but the  parameter isn't formatted correctly, " +
        "when the api is called, it should return a 422", async()=>{
        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'stub'}});
        const request = new Request('/api/friends/deny', {
            method: 'POST',
            body: 'non-formatted string',
            headers: { 'Content-Type': 'application/json' }
        });
        const response = await POST(request);
        expect(response.status).toEqual(422);
        expect(response.body?.toString()).toEqual('Invalid Request Payload');
    })

    test("given the session works and the parameter is formatted correctly, when the api is called, " +
        "then it won't return a 422", async()=>{
        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'stub'}});
        const request = new Request('/api/friends/deny', {
            method: 'POST',
            body: JSON.stringify({ id: 'validID' }),
            headers: { 'Content-Type': 'application/json' }
        });
        const response = await POST( request);
        expect(response.status).not.toEqual(421);
        expect(response.body?.toString()).not.toEqual('Invalid Request payload');
    })

    test("given the session works, the parameter is formatted correctly and the database throws, " +
        "when the api is called, then it won't return a 400", async()=>{
        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'stub'}});
        const request = new Request('/api/friends/deny', {
            method: 'POST',
            body: JSON.stringify({ id: 'validID' }),
            headers: { 'Content-Type': 'application/json' }
        });
        (removeDbEntry as jest.Mock).mockImplementation(()=>{throw new Error('Bad')});
        const response = await POST(request);
        expect(response.status).toEqual(424);
        expect(response.body?.toString()).toEqual('Redis Error');
    })

    test("given the session works, the parameter is formatted correctly and the database doesn't throw, " +
        "when the api is called, then it will return a 200", async()=>{
        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'stub'}});
        const request = new Request('/api/friends/deny', {
            method: 'POST',
            body: JSON.stringify({ id: 'validID' }),
            headers: { 'Content-Type': 'application/json' }
        });
        const response = await POST(request);
        expect(response.status).toEqual(200);
        expect(response.body?.toString()).toEqual('OK');
    })
})

describe('Arguments passed to database',()=>{
    beforeEach(()=>{
        jest.resetAllMocks();
        (removeDbEntry as jest.Mock).mockImplementation(()=>jest.fn());
        (getPusherServer as jest.Mock).mockReturnValue({trigger: jest.fn()});
    })

    test('given a user id of "12345", when the endpoint is called, ' +
        'then the first argument to wrapper "removeEntry" is "user:12345:incoming_friend_requests"',async ()=>{
        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'12345'}});
        const request = new Request('/api/friends/deny', {
            method: 'POST',
            body: JSON.stringify({ id: 'stub' }),
            headers: { 'Content-Type': 'application/json' }
        });
        await POST(request);
        expect(removeDbEntry as jest.Mock).toHaveBeenCalledWith('user:12345:incoming_friend_requests', expect.anything());
    })

    test('given a user id of "lColumbo", when the endpoint is called, ' +
        'then the first argument to wrapper "removeEntry" is "user:lColumbo:incoming_friend_requests"',async ()=>{
        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'lColumbo'}});
        const request = new Request('/api/friends/deny', {
            method: 'POST',
            body: JSON.stringify({ id: 'stub' }),
            headers: { 'Content-Type': 'application/json' }
        });
        await POST(request);
        expect(removeDbEntry as jest.Mock).toHaveBeenCalledWith('user:lColumbo:incoming_friend_requests',
            expect.anything());
    })

    test('given a body id of "lColumbo", when the endpoint is called, ' +
        'then the second argument to wrapper "removeEntry" is "lColumbo"',async ()=>{
        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'stub'}});
        const request = new Request('/api/friends/deny', {
            method: 'POST',
            body: JSON.stringify({ id: 'lColumbo' }),
            headers: { 'Content-Type': 'application/json' }
        });
        await POST(request);
        expect(removeDbEntry as jest.Mock).toHaveBeenCalledWith(expect.anything(), 'lColumbo')
    })

    test('given a body id of "bruceWayne", when the endpoint is called, ' +
        'then the second argument to wrapper "removeEntry" is "bruceWayne"',async ()=>{
        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'stub'}});
        const request = new Request('/api/friends/deny', {
            method: 'POST',
            body: JSON.stringify({ id: 'bruceWayne' }),
            headers: { 'Content-Type': 'application/json' }
        });
        await POST(request);
        expect(removeDbEntry as jest.Mock).toHaveBeenCalledWith(expect.anything(), 'bruceWayne')
    })
})

describe('events sent to pusher',()=>{
    test("Given a session user id of 1966, when the endpoint is called, " +
        "then the trigger is called with the channel 'user__1966__friends'", async()=>{
        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'1966'}});
        const triggerSpy= jest.fn();
        (getPusherServer as jest.Mock).mockReturnValue({trigger: triggerSpy});
        const request = new Request('/api/friends/deny', {
            method: 'POST',
            body: JSON.stringify({ id: 'stub' }),
            headers: { 'Content-Type': 'application/json' }
        });
        await POST(request);
        expect(triggerSpy).toHaveBeenCalledWith("user__1966__friends", expect.anything(), expect.anything());
    })

    test("Given a session user id of 1701, when the endpoint is called, " +
        "then the trigger is called with the channel 'user__1701__friends'", async()=>{
        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'1966'}});
        const triggerSpy= jest.fn();
        (getPusherServer as jest.Mock).mockReturnValue({trigger: triggerSpy});
        const request = new Request('/api/friends/deny', {
            method: 'POST',
            body: JSON.stringify({ id: 'stub' }),
            headers: { 'Content-Type': 'application/json' }
        });
        await POST(request);
        expect(triggerSpy).toHaveBeenCalledWith("user__1701__friends", expect.anything(), expect.anything());
    })
})
