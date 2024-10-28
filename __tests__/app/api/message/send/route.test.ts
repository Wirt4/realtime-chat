import {POST} from "@/app/api/message/send/route";
import myGetServerSession from "@/lib/myGetServerSession";
import fetchRedis from "@/helpers/redis";
import {db} from "@/lib/db"

jest.mock("@/helpers/redis", ()=>jest.fn());
jest.mock("@/lib/myGetServerSession",()=> jest.fn());
jest.mock('@/lib/db', () => ({
    db: {
        zadd: jest.fn(),
    },
}));

describe('api/message/send tests', () => {
    let request: Request
    beforeEach(()=>{
        jest.resetAllMocks()
        request = new Request("/message/send", {
            method: "POST",
            body: "{\"chatId\": \"bar--foo\"}",
        });
        (fetchRedis as jest.Mock).mockResolvedValue(['bar']);
    })
    test('If session is null, then return a 401 Unauthorized',async ()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue(null);
        const response = await POST(request)
        expect(response).toEqual(expect.objectContaining({status: 401, statusText: 'Unauthorized'}));
    })
    test('Is fine, do not 401 Unauthorized',async ()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: 'foo'}});
        const response = await POST(request)
        expect(response).not.toEqual(expect.objectContaining({status: 401, statusText: 'Unauthorized'}));
    })
    test('userid is not part of the chat, return 401 unauthorized',async ()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: 'foo'}});
        request= new Request("/message/send", {
            method: "POST",
            body: "{\"chatId\": \"alpha--beta\"}",
        });
        const response = await POST(request)
        expect(response).toEqual(expect.objectContaining({status: 401, statusText: 'Unauthorized'}));
    })
    test('if the chat partner is not part of the users friends list, then should return unauthorized',async ()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: 'foo'}});
        (fetchRedis as jest.Mock).mockResolvedValue([]);
        request= new Request("/message/send", {
            method: "POST",
            body: "{\"chatId\": \"bar--foo\"}",
        });
        const response = await POST(request)
        expect(response).toEqual(expect.objectContaining({status: 401, statusText: 'Unauthorized'}));
    })

    test('confirm fetchRedis is called with correct arguments',async ()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: 'foo'}});
        (fetchRedis as jest.Mock).mockResolvedValue([]);
        request= new Request("/message/send", {
            method: "POST",
            body: "{\"chatId\": \"bar--foo\"}",
        });
        await POST(request)
        expect(fetchRedis as jest.Mock).toHaveBeenCalledWith('smembers', 'user:foo:friends')
    })

    test('confirm fetchRedis is called with correct arguments, different data',async ()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: 'bar'}});
        (fetchRedis as jest.Mock).mockResolvedValue([]);
        request= new Request("/message/send", {
            method: "POST",
            body: "{\"chatId\": \"bar--foo\"}",
        });
        await POST(request)
        expect(fetchRedis as jest.Mock).toHaveBeenCalledWith('smembers', 'user:bar:friends')
    })
})

describe('api/message/send tests, parameters passed to database when authorization is green', () => {
    let request: Request

    beforeEach(()=>{
        jest.resetAllMocks()
        request = new Request("/message/send", {
            method: "POST",
            body: "{\"chatId\": \"bar--foo\"}",
        });
        (fetchRedis as jest.Mock).mockResolvedValue(['bar']);
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: 'foo'}});
    })

    test('db.zadd is called',async ()=>{
        await POST(request)
        expect(db.zadd as jest.Mock).toHaveBeenCalled();
    })

    test('db.zadd is called with chat:bar--foo:messages',async ()=>{
        await POST(request)
        expect(db.zadd as jest.Mock).toHaveBeenCalledWith('chat:bar--foo:messages');
    })

    test('db.zadd is called with chat:kirk--spock:messages',async ()=>{
        request = new Request("/message/send", {
            method: "POST",
            body: "{\"chatId\": \"kirk--spock\"}",
        });
        (fetchRedis as jest.Mock).mockResolvedValue(['spock']);
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: 'kirk'}});
        await POST(request)
        expect(db.zadd as jest.Mock).toHaveBeenCalledWith('chat:kirk--spock:messages');
    })
})
