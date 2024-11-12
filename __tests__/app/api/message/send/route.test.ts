import {POST} from "@/app/api/message/send/route";
import myGetServerSession from "@/lib/myGetServerSession";
import fetchRedis from "@/helpers/redis";
import {db} from "@/lib/db"
import {nanoid} from "nanoid";
import {messageSchema} from "@/lib/validations/messages";
import {getPusherServer} from "@/lib/pusher";

jest.mock("@/helpers/redis", ()=>jest.fn());
jest.mock("@/lib/myGetServerSession",()=> jest.fn());
jest.mock('@/lib/db', () => ({
    db: {
        zadd: jest.fn(),
    },
}));
jest.mock("nanoid",() => ({
    nanoid: jest.fn(),
}));

jest.mock("@/lib/pusher",()=>({
    getPusherServer: jest.fn()
}));

describe('api/message/send tests', () => {
    let request: Request
    beforeEach(()=>{
        jest.resetAllMocks()
        request = new Request("/message/send", {
            method: "POST",
            body: "{\"chatId\": \"bar--foo\",\"text\":\"hello\"}",
        });
        (fetchRedis as jest.Mock).mockResolvedValue(['bar']);
        (nanoid as jest.Mock).mockReturnValue('c-3po');
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'foo'}});
        (getPusherServer as jest.Mock).mockReturnValue({trigger: jest.fn()});

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

    test('okay response, should be a 200 with message "OK"',async ()=>{
        const response = await POST(request)
        expect(response).toEqual(expect.objectContaining({status: 200, statusText: 'OK'}));
    });
});

describe('determine arguments passed to fetchRedis', ()=>{
    let request: Request

    beforeEach(()=>{
        jest.resetAllMocks()
        request = new Request("/message/send", {
            method: "POST",
            body: "{\"chatId\": \"bar--foo\",\"text\":\"hello\"}",
        });
        (fetchRedis as jest.Mock).mockResolvedValue(['bar']);
        (nanoid as jest.Mock).mockReturnValue('c-3po');

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
        request = new Request("/message/send", {
            method: "POST",
            body: "{\"chatId\": \"bar--foo\"}",
        });
        await POST(request)
        expect(fetchRedis as jest.Mock).toHaveBeenCalledWith('smembers', 'user:bar:friends')
    })
})

describe('api/message/send tests, parameters passed to database when authorization is green', () => {
    let request: Request
    beforeAll(()=>{
        jest.useFakeTimers(); // Use modern fake timers
    })

    beforeEach(()=>{
        jest.resetAllMocks()
        request = new Request("/message/send", {
            method: "POST",
            body: "{\"chatId\": \"bar--foo\"}",
        });
        (fetchRedis as jest.Mock).mockResolvedValue(['bar']);
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: 'foo'}});
        jest.setSystemTime(new Date('2023-01-01T12:00:00Z'));
        // @ts-expect-error coerce for testing
        jest.spyOn(messageSchema, 'parse').mockImplementation(a=>a);
        (getPusherServer as jest.Mock).mockReturnValue({trigger: jest.fn()});
    })

    afterAll(()=>{
        jest.useRealTimers()
    })

    test('db.zadd is called',async ()=>{
        await POST(request)
        expect(db.zadd as jest.Mock).toHaveBeenCalled();
    })

    test("if zod doesn't verify, do not have db.zadd called",async ()=>{
        jest.spyOn(messageSchema, 'parse').mockImplementationOnce(()=>{throw new Error('not validated')})
        try{
            await POST(request)
        }catch{}finally {
            expect(db.zadd as jest.Mock).not.toHaveBeenCalled();
        }
    })

    test('db.zadd is called with chat:bar--foo:messages',async ()=>{
        await POST(request)
        expect(db.zadd as jest.Mock).toHaveBeenCalledWith('chat:bar--foo:messages', expect.anything());
    })

    test('db.zadd is called with chat:kirk--spock:messages',async ()=>{
        request = new Request("/message/send", {
            method: "POST",
            body: "{\"chatId\": \"kirk--spock\"}",
        });
        (fetchRedis as jest.Mock).mockResolvedValue(['spock']);
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: 'kirk'}});
        await POST(request)
        expect(db.zadd as jest.Mock).toHaveBeenCalledWith('chat:kirk--spock:messages', expect.anything());
    })

    test('db.zadd is called with correct timestamp in second argument',async ()=>{
        jest.setSystemTime(new Date(1730156654))
        await POST(request)
        expect(db.zadd as jest.Mock).toHaveBeenCalledWith(expect.anything(),
            expect.objectContaining({score:1730156654}));
    })

    test('db.zadd is called with correct timestamp in second argument, different data',async ()=>{
        jest.setSystemTime(new Date(522497054))
        await POST(request)
        expect(db.zadd as jest.Mock).toHaveBeenCalledWith(expect.anything(),
            expect.objectContaining({score:522497054}));
    })

    test('db.zadd is called with correct message stringified and passed to member',async ()=>{
        jest.setSystemTime(new Date(522497054));
        (nanoid as jest.Mock).mockReturnValue('c-3po');
        request = new Request("/message/send", {
            method: "POST",
            body: "{\"chatId\": \"anthony--kenny\",\"text\":\"hello\"}",
        });
        (fetchRedis as jest.Mock).mockResolvedValue(['kenny']);
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: 'anthony'}});
        const expected = "{\"id\":\"c-3po\",\"senderId\":\"anthony\",\"text\":\"hello\",\"timestamp\":522497054}"
        await POST(request)
        expect(db.zadd as jest.Mock).toHaveBeenCalledWith(expect.anything(),
            expect.objectContaining({member:expected}));
    })
    test('db.zadd is called with correct message stringified and passed to member, differnt nanoid',async ()=>{
        jest.setSystemTime(new Date(522497054));
        (nanoid as jest.Mock).mockReturnValue('r2-d2');
        request = new Request("/message/send", {
            method: "POST",
            body: "{\"chatId\":\"anthony--kenny\",\"text\":\"hello\"}",
        });
        (fetchRedis as jest.Mock).mockResolvedValue(['kenny']);
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: 'anthony'}});
        const expected = "{\"id\":\"r2-d2\",\"senderId\":\"anthony\",\"text\":\"hello\",\"timestamp\":522497054}"
        await POST(request)
        expect(db.zadd as jest.Mock).toHaveBeenCalledWith(expect.anything(),
            expect.objectContaining({member:expected}));
    })

    test('db.zadd is called with correct message stringified and passed to member, differnt senderid',async ()=>{
        jest.setSystemTime(new Date(522497054));
        (nanoid as jest.Mock).mockReturnValue('r2-d2');
        request = new Request("/message/send", {
            method: "POST",
            body: "{\"chatId\":\"anthony--kenny\",\"text\":\"hello\"}",
        });
        (fetchRedis as jest.Mock).mockResolvedValue(['anthony']);
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: 'kenny'}});
        const expected = "{\"id\":\"r2-d2\",\"senderId\":\"kenny\",\"text\":\"hello\",\"timestamp\":522497054}"
        await POST(request)
        expect(db.zadd as jest.Mock).toHaveBeenCalledWith(expect.anything(),
            expect.objectContaining({member:expected}));
    })

    test('db.zadd is called with correct message stringified and passed to member, differnt text in request',async ()=>{
        jest.setSystemTime(new Date(522497054));
        (nanoid as jest.Mock).mockReturnValue('r2-d2');
        request = new Request("/message/send", {
            method: "POST",
            body: "{\"chatId\":\"anthony--kenny\",\"text\":\"fluff off\"}",
        });
        (fetchRedis as jest.Mock).mockResolvedValue(['anthony']);
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: 'kenny'}});
        const expected = "{\"id\":\"r2-d2\",\"senderId\":\"kenny\",\"text\":\"fluff off\",\"timestamp\":522497054}"
        await POST(request)
        expect(db.zadd as jest.Mock).toHaveBeenCalledWith(expect.anything(),
            expect.objectContaining({member:expected}));
    })
    test('db.zadd is called with correct message stringified and passed to member, different timestamp',async ()=>{
        jest.setSystemTime(new Date(1730156654));
        (nanoid as jest.Mock).mockReturnValue('r2-d2');
        request = new Request("/message/send", {
            method: "POST",
            body: "{\"chatId\":\"anthony--kenny\",\"text\":\"fluff off\"}",
        });
        (fetchRedis as jest.Mock).mockResolvedValue(['anthony']);
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: 'kenny'}});
        const expected = "{\"id\":\"r2-d2\",\"senderId\":\"kenny\",\"text\":\"fluff off\",\"timestamp\":1730156654}"
        await POST(request)
        expect(db.zadd as jest.Mock).toHaveBeenCalledWith(expect.anything(),
            expect.objectContaining({member:expected}));
    })
})

describe('error cases',()=>{
    let request: Request
    beforeEach(()=>{
        jest.resetAllMocks()
        request = new Request("/message/send", {
            method: "POST",
            body: "{\"chatId\": \"bar--foo\",\"text\":\"hello\"}",
        });
        (fetchRedis as jest.Mock).mockResolvedValue(['bar']);
        (nanoid as jest.Mock).mockReturnValue('c-3po');
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'foo'}});

    })
test('something throws an error with an instance of error',async ()=>{
    (myGetServerSession as jest.Mock).mockImplementationOnce(()=>{
        throw new Error('I am a teapot');
    });
    const response = await POST(request)
    expect(response).toEqual(expect.objectContaining({status: 500, statusText: 'I am a teapot'}));
})
    test('something throws an error with an instance of error, different data',async ()=>{
        (nanoid as jest.Mock).mockImplementationOnce(()=>{
            throw new Error('You typed it wrong');
        });
        const response = await POST(request)
        expect(response).toEqual(expect.objectContaining({status: 500, statusText: 'You typed it wrong'}));
    })

    test("Can't identfy the error, just do internal server",async ()=>{
        (nanoid as jest.Mock).mockImplementationOnce(()=>{
            throw false;
        });
        const response = await POST(request)
        expect(response).toEqual(expect.objectContaining({status: 500, statusText: 'Internal Server Error'}));
    })
})

describe('events sent to pusher',()=>{
    let request: Request

    beforeAll(()=>{
        jest.useFakeTimers(); // Use modern fake timers
    })

    beforeEach(()=>{
        jest.resetAllMocks()
        request = new Request("/message/send", {
            method: "POST",
            body: "{\"chatId\": \"bar--foo\"}",
        });
        (fetchRedis as jest.Mock).mockResolvedValue(['bar']);
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: 'foo'}});
        jest.setSystemTime(new Date('2023-01-01T12:00:00Z'));
        // @ts-expect-error coerce for testing
        jest.spyOn(messageSchema, 'parse').mockImplementation(a=>a)
    })

    afterAll(()=>{
        jest.useRealTimers()
    })
    test('Given a chat Id of "batman--robin" and no errors:' +
        ' when the endpoint is called, then pusher.trigger is called with the channel "chat__batman--robin"', async()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: 'batman'}});
        (fetchRedis as jest.Mock).mockResolvedValue(['robin']);
        const triggerSpy = jest.fn();
        (getPusherServer as jest.Mock).mockReturnValue({trigger: triggerSpy});

        request = new Request("/message/send", {
            method: "POST",
            body: "{\"chatId\": \"batman--robin\",\"text\":\"Gotham needs us\"}"
        });

        await POST(request);

        expect(triggerSpy).toHaveBeenCalledWith('chat__batman--robin', expect.anything(), expect.anything());
    })
})
