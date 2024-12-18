import { POST } from "@/app/api/friends/accept/route";
import myGetServerSession from "@/lib/myGetServerSession";
import fetchRedis from "@/helpers/redis";
import { db } from '@/lib/db';
import { getPusherServer} from "@/lib/pusher";

jest.mock("@/lib/pusher",()=>({
    getPusherServer: jest.fn()
}));

jest.mock("@/lib/myGetServerSession",()=>({
    __esModule: true,
    default: jest.fn()
}));

jest.mock("@/lib/db",()=>({
    __esModule: true,
    db: {
        sadd: jest.fn(),
        srem: jest.fn()
    }
}));

jest.mock('@/helpers/redis');

interface expectedResponse {
    text: string,
    status: number
}

describe('/api/friends/accept', () => {
    beforeEach(() => {
        (fetchRedis as jest.Mock).mockResolvedValue(false);
        (getPusherServer as jest.Mock).mockReturnValue({trigger: jest.fn()});
    });

    afterEach(()=>{
        jest.resetAllMocks();
    })

    test('If is all anticipated case, then POST runs without throwing', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
        const req = requestFromId('valid')
        await POST(req);
    });

    test('If the request value is not a string, then POST returns a 422', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
        const req = requestFromId(42)
        const expectedResponse: expectedResponse = {
            status: 422,
            text: 'Invalid Request'
        }
        const response = await POST(req);
        assertResponse(response, expectedResponse)
    });

    test("If the user's session is null, then POST returns a 401", async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
        (myGetServerSession as jest.Mock).mockResolvedValue(null);
        const req = requestFromId('valid')
        const expected: expectedResponse = {
            status:401,
            text: 'Unauthorized'
        }
        const response =  await POST(req);
        assertResponse(response, expected);
    });

    test("If the user's session is valid, then  POST doesn't return 401 Unauthorized", async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'1701'}});
        const req = requestFromId('valid')
        const response =  await POST(req);
        const notExpected: expectedResponse = {
            status: 401,
            text: 'Unauthorized'
        }
        assertNotResponse(response, notExpected);
    });

    test('If fetchRedis"(sismember, user:1701:friends)" is truthy, then POST returns 401, Already Friends', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'1701'}});
        const req = requestFromId('valid');
        (fetchRedis as jest.Mock).mockResolvedValue(true);

        const response =  await POST(req);
        const expected: expectedResponse = {
            text: 'Already Friends',
            status: 400
        }
        assertResponse(response, expected)
    });

    test('If fetchRedis("sismember, user:1701:friends)" is falsy, then POST does not return Already Friends 400',
        async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'1701'}});
        const req = requestFromId('valid');
        (fetchRedis as jest.Mock).mockResolvedValue(false);

        const response =  await POST(req);
        const expected: expectedResponse = {
            text: 'Already Friends',
            status: 400
        }
        assertNotResponse(response, expected)
    });

    test('If POST is called by user 5468, then fetchRedis is called with second arg == "5468"', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'1701'}});
        const req = requestFromId('5468');
        await POST(req);
        expect(fetchRedis as jest.Mock).toHaveBeenCalledWith(expect.anything(),expect.anything(), '5468');
    });

    test('If POST is called with a request for 1701, then fetchRedis is called with first arg == "user:1701:friends" ', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'1701'}});
        const req = requestFromId('5468');
        await POST(req);
        expect(fetchRedis as jest.Mock).toHaveBeenCalledWith(expect.anything(),'user:1701:friends', expect.anything());
    });

    test('If POST is called , then fetchRedis is called with command == "sismember" ', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'1701'}});
        const req = requestFromId('5468');
        await POST(req);
        expect(fetchRedis as jest.Mock).toHaveBeenCalledWith("sismember",expect.anything(), expect.anything());
    });

    test('If POST is called by user 1701, then fetchRedis is be called with second arg == 1701 ', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'1966'}});
        const req = requestFromId('1701');
        await POST(req);
        expect(fetchRedis as jest.Mock).toHaveBeenCalledWith(expect.anything(),expect.anything(), '1701');
    });

    test('If POST is called with 1966 in payload, then fetchRedis should be called with first arg == user:1966:friends,', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'1966'}});
        const req = requestFromId('1701');
        await POST(req);
        expect(fetchRedis as jest.Mock).toHaveBeenCalledWith(expect.anything(),'user:1966:friends', expect.anything());
    });

    test(" If fetchRedis' call to :incoming_friend_requests returns a falsy value, then POST returns a 400", async()=>{
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'1966'}});
        (fetchRedis as jest.Mock).mockImplementation(redisMock(false))
        const expected: expectedResponse ={
            text:'No Existing Friend Request',
            status: 400
        }

        const request = requestFromId('1701');
        const response = await POST(request);
        assertResponse(response, expected);
    });

    test("If fetcRedis' call to :incoming_friend_requests returns a truthy value,then POST calls db.sadd", async()=>{
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'1966'}});
        (fetchRedis as jest.Mock).mockImplementation(redisMock())

        const request = requestFromId('1701');
        await POST(request);
        expect(db.sadd).toHaveBeenCalledWith('user:1966:friends', '1701');
        expect(db.sadd).toHaveBeenCalledWith('user:1701:friends', '1966');
    });

    test(" If fetcRedis' call to :incoming_friend_requests returns a truthy value, then POST calls db.sadd , different data", async()=>{
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'8569'}});
        (fetchRedis as jest.Mock).mockImplementation(redisMock());

        const request = requestFromId('666');
        await POST(request);

        expect(db.sadd).toHaveBeenCalledWith('user:8569:friends', '666');
        expect(db.sadd).toHaveBeenCalledWith('user:666:friends', '8569');
    });

    test("If POST is successfully called, then the idToAdd is removed from the user's requests table", async()=>{
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'8569'}});
        (fetchRedis as jest.Mock).mockImplementation(redisMock());

        const request = requestFromId('666');
        await POST(request);

        expect(db.srem).toHaveBeenCalledWith('user:8569:incoming_friend_requests', '666');
    });

    test("If POST is successfully called, then the idToAdd is removed from the user's requests table, different data",
        async()=>{
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'4567'}});
        (fetchRedis as jest.Mock).mockImplementation(redisMock());

        const request = requestFromId('7777');
        await POST(request);

        expect(db.srem).toHaveBeenCalledWith('user:4567:incoming_friend_requests', '7777');
    });
});

describe('calls to pusher',()=>{
    let triggerSpy: jest.SpyInstance;

    beforeEach(() => {
        triggerSpy = jest.fn();
        (getPusherServer as jest.Mock).mockReturnValue({trigger: triggerSpy});
        (fetchRedis as jest.Mock).mockImplementation(redisMock());
    })

    afterEach(()=>{
        jest.resetAllMocks();
    })

    test('id to add is 12345 expect pusher.trigger to be called with first arg "user__12345__friends"', async ()=>{
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'1966'}});
        const req = requestFromId('12345')
        await POST(req);
        expect(triggerSpy).toHaveBeenCalledWith("user__12345__friends", expect.anything(), expect.anything());
    })

    test('id to add is 54321 expect pusher.trigger to be called with first arg "user__12345__friends"', async ()=>{
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'1966'}});
        const req = requestFromId('54321')
        await POST(req);
        expect(triggerSpy).toHaveBeenCalledWith("user__54321__friends", expect.anything(), expect.anything());
    })

    test('id to add is 54321 expect pusher.trigger to be called with event "new_friend"', async ()=>{
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'1966'}});
        const req = requestFromId('54321')
        await POST(req);
        expect(triggerSpy).toHaveBeenCalledWith(expect.anything(), 'new_friend', expect.anything());
    })

    test('expect pusher.trigger to be called with data of the current user', async ()=>{
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'1966'}});
        const req = requestFromId('54321')
        await POST(req);
        expect(triggerSpy).toHaveBeenCalledWith(expect.anything(), expect.anything(), {
            name: 'Adam',
            email: 'adam@batcave.com',
            image: 'stub',
            id: '1966'
        });
    });

    test('expect pusher.trigger to be called with data of the current user, different data', async ()=>{
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'1701'}});
        const req = requestFromId('54321')
        await POST(req);
        expect(triggerSpy).toHaveBeenCalledWith(expect.anything(), expect.anything(), {
            name: 'William',
            email: 'bill@canda.ca',
            image: 'stub',
            id: '1701'
        });
    })

    test('needs two calls: one for the user and one for the id to add', async ()=>{
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'1701'}});
        const req = requestFromId('1966')
        await POST(req);
        expect(triggerSpy).toHaveBeenCalledWith("user__1966__friends", 'new_friend', {
            name: 'William',
            email: 'bill@canda.ca',
            image: 'stub',
            id: '1701'
        });
        expect(triggerSpy).toHaveBeenCalledWith("user__1701__friends", 'new_friend', {
            name: 'Adam',
            email: 'adam@batcave.com',
            image: 'stub',
            id: '1966'
        });
    })
})

function assertResponse( response: Response, expected: expectedResponse): void{
    expect(response.status).toEqual(expected.status);
    expect(response.body?.toString()).toEqual(expected.text);
}

function assertNotResponse( response: Response, expected: expectedResponse): void{
    expect(response.status === expected.status && response.body?.toString()== expected.text);
}

function requestFromId(id: string | number): Request{
    return new Request('/api/friends/accept', {
        method: 'POST',
        body: JSON.stringify({ id: id }),
        headers: { 'Content-Type': 'application/json' }
    });
}

function redisMock(isGreen: boolean = true){
    return async ( command: string, query:string, opts:string)=>{
        if (command == 'sismember'){
            const arr = query.split(':');
            const query_name = arr[arr.length-1];
            switch(query_name){
                case 'friends':
                    return false;
                case 'incoming_friend_requests':
                    return isGreen ? 1 : 0;
                default:
                    throw new Error('invalid table');
            }
        }
        const arr = query.split(':');
        const query_name = arr[arr.length-1];
        switch(query_name){
            case '1966':
                return {
                    name: 'Adam',
                    email: 'adam@batcave.com',
                    image: 'stub',
                    id: '1966'
                }
            case '1701':
                return {
                    name: 'William',
                    email: 'bill@canda.ca',
                    image: 'stub',
                    id: '1701'
                }
                default:
                    return {}
        }
    }
}
