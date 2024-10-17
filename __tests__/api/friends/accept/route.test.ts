import { POST } from "@/app/api/friends/accept/route";
import myGetServerSession from "@/lib/myGetServerSession";
import fetchRedis from "@/helpers/redis";
import { db } from '@/lib/db';

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
    });

    afterEach(()=>{
        jest.resetAllMocks();
    })

    test('POST should run without throwing', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
        const req = requestify('valid')
        await POST(req);
    });

    test('method throws if value is not string', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
        const req = requestify(42)
        const expectedResponse: expectedResponse = {
            status: 422,
            text: 'Invalid Request'
        }
        const response = await POST(req);
        assertResponse(response, expectedResponse)
    });

    test('If session is null, return 401 UnAuthorized', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
        (myGetServerSession as jest.Mock).mockResolvedValue(null);
        const req = requestify('valid')
        const expected: expectedResponse = {
            status:401,
            text: 'Unauthorized'
        }
        const response =  await POST(req);
        assertResponse(response, expected);
    });

    test('If session is not null, do not return 401 UnAuthorized', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'1701'}});
        const req = requestify('valid')
        const response =  await POST(req);
        const notExpected: expectedResponse = {
            status: 401,
            text: 'Unauthorized'
        }
        assertNotResponse(response, notExpected);
    });

    test('fetchRedis(sismember, user:1701:friends is truthy, response should be Already Friends 400', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'1701'}});
        const req = requestify('valid');
        (fetchRedis as jest.Mock).mockResolvedValue(true);

        const response =  await POST(req);
        const expected: expectedResponse = {
            text: 'Already Friends',
            status: 400
        }
        assertResponse(response, expected)
    });

    test('fetchRedis(sismember, user:1701:friends is falsy, response should not be Already Friends 400', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'1701'}});
        const req = requestify('valid');
        (fetchRedis as jest.Mock).mockResolvedValue(false);

        const response =  await POST(req);
        const expected: expectedResponse = {
            text: 'Already Friends',
            status: 400
        }
        assertNotResponse(response, expected)
    });

    test('fetchRedis should be called with sismember, user:1701:friends, 5468  ', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'1701'}});
        const req = requestify('5468');
        await POST(req);
        expect(fetchRedis as jest.Mock).toHaveBeenCalledWith('sismember','user:1701:friends', '5468');
    });

    test('fetchRedis should be called with sismember, user:1966:friends, 1701 ', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'1966'}});
        const req = requestify('1701');
        await POST(req);
        expect(fetchRedis as jest.Mock).toHaveBeenCalledWith('sismember','user:1966:friends', '1701');
    });

    test("fetcRedis' call to :incoming_friend_requests returns a falsy value", async()=>{
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'1966'}});
        (fetchRedis as jest.Mock).mockImplementation(redisMock(false))
        const expected: expectedResponse ={
            text:'No Existing Friend Request',
            status: 400
        }

        const request = requestify('1701');
        const response = await POST(request);

        assertResponse(response, expected);
    });

    test("fetcRedis' call to :incoming_friend_requests returns a truthy value, expect db.sadd to be called", async()=>{
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'1966'}});
        (fetchRedis as jest.Mock).mockImplementation(redisMock())

        const request = requestify('1701');
        await POST(request);
        expect(db.sadd).toHaveBeenCalledWith('user:1966:friends', '1701');
        expect(db.sadd).toHaveBeenCalledWith('user:1701:friends', '1966');
    });

    test("fetcRedis' call to :incoming_friend_requests returns a truthy value, expect db.sadd to be called, different data", async()=>{
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'8569'}});
        (fetchRedis as jest.Mock).mockImplementation(redisMock());

        const request = requestify('666');
        await POST(request);

        expect(db.sadd).toHaveBeenCalledWith('user:8569:friends', '666');
        expect(db.sadd).toHaveBeenCalledWith('user:666:friends', '8569');
    });

    test("expect the idtoAdd to be removed from the user's requests table", async()=>{
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'8569'}});
        (fetchRedis as jest.Mock).mockImplementation(redisMock());

        const request = requestify('666');
        await POST(request);

        expect(db.srem).toHaveBeenCalledWith('user:8569:incoming_friend_requests', '666');
    });

    test("expect the idtoAdd to be removed from the user's requests table", async()=>{
        fetchMock.mockResponseOnce(JSON.stringify({ success: true }));
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'4567'}});
        (fetchRedis as jest.Mock).mockImplementation(redisMock());

        const request = requestify('7777');
        await POST(request);

        expect(db.srem).toHaveBeenCalledWith('user:4567:incoming_friend_requests', '7777');
    });
});

function assertResponse( response: Response, expected: expectedResponse): void{
    expect(response.status).toEqual(expected.status);
    expect(response.body?.toString()).toEqual(expected.text);
}

function assertNotResponse( response: Response, expected: expectedResponse): void{
    expect(response.status === expected.status && response.body?.toString()== expected.text);
}

function requestify(id: string | number): Request{
    return new Request('/api/friends/accept', {
        method: 'POST',
        body: JSON.stringify({ id: id }),
        headers: { 'Content-Type': 'application/json' }
    });
}

function redisMock(isGreen: boolean = true){
    return async ( command: string, query:string, opts:string)=>{
        const arr = query.split(':');
        const table_name = arr[arr.length-1];
        switch(table_name){
            case 'friends':
                return false;
            case 'incoming_friend_requests':
                return isGreen ? 1 : 0;
            default:
                throw new Error('invalid table');
        }
    }
}
