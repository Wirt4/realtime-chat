import {PostFriendsRouteHandler} from '@/app/api/friends/add/handler'
import fetchRedis from "@/helpers/redis"
import { db } from '@/lib/db';

jest.mock("@/lib/myGetServerSession",()=>({
    __esModule: true,
    default: jest.fn()
}));

jest.mock("@/helpers/redis",()=>({
    __esModule: true,
    default: jest.fn()
}));

jest.mock("@/lib/db",()=>({
    __esModule: true,
    db: {
        sadd: jest.fn() // Mock the sadd method
    }
}));

describe('Validate Tests - true verses false', () => {
    let handler: PostFriendsRouteHandler
    beforeEach(()=>{
        handler = new PostFriendsRouteHandler();
    })
    afterEach(()=>{
        jest.resetAllMocks();
    })
    test("if the parameter email is invalid, then the handler response is a 422", async()=>{
        jest.spyOn(handler, 'validateEmail').mockImplementation(()=>{
            throw new Error('error');
        })
        const expected = {message:'Invalid request payload',
            opts: { status: 422 }
        }

       await handler.isValidRequest({email:'stupid invalid email'});
        expect(handler.errorResponse()).toEqual(expected);
    });

    test("if userExists returns false, then the errorResponse is a 400", async()=>{
        jest.spyOn(handler, 'validateEmail').mockReturnValue({email:'valid@email.com'});
        jest.spyOn(handler, 'userExists').mockResolvedValue(false);
        const expected = {
            message:'This person does not exist.',
            opts: { status: 400 }
        }


       await handler.isValidRequest({email:'example@example.com'});
        expect(handler.errorResponse()).toEqual(expected);
    });

    test("if the session is falsy, then  the error response is a 401", async()=>{
        jest.spyOn(handler, 'validateEmail').mockReturnValue({email:'valid@email.com'});
        jest.spyOn(handler, 'userExists').mockResolvedValue(true);
        //@ts-expect-error rough type coersion, need non-null value
        jest.spyOn(handler, 'getSession').mockResolvedValue(false);
        const expected = {
            message:'unauthorized',
            opts: { status: 401 }
        }
        await handler.isValidRequest({email:'example@example.com'});
        expect(handler.errorResponse()).toEqual(expected);
    });

    test("if the user attempts to add themself, then the error response is a 400", async()=>{
        jest.spyOn(handler, 'validateEmail').mockReturnValue({email:'valid@email.com'});
        jest.spyOn(handler, 'userExists').mockResolvedValue(true);
        //@ts-expect-error rough type coersion, need non-null value
        jest.spyOn(handler, 'getSession').mockResolvedValue(true);
        jest.spyOn(handler, 'isSameUser').mockReturnValue(true);
        const expected = {
            message:'You cannot add yourself as a friend',
            opts: { status: 400 }
        }
        await handler.isValidRequest({email:'example@example.com'});
        expect(handler.errorResponse()).toEqual(expected);
    })

    test("if the target is already added, then the error response is a 400", async()=>{
        jest.spyOn(handler, 'validateEmail').mockReturnValue({email:'valid@email.com'});
        jest.spyOn(handler, 'userExists').mockResolvedValue(true);
        //@ts-expect-error rough type coersion, need non-null value
        jest.spyOn(handler, 'getSession').mockResolvedValue(true);
        jest.spyOn(handler, 'isSameUser').mockReturnValue(false);
        jest.spyOn(handler, 'isAlreadyAdded').mockResolvedValue(true);
        const expected = {
            message:'You\'ve already added this user',
            opts: { status: 400 }
        }
        await handler.isValidRequest({email:'example@example.com'});
        expect(handler.errorResponse()).toEqual(expected);
    });

    test("if the target is already added, then the error response is a 400, different data", async()=>{
        jest.spyOn(handler, 'validateEmail').mockReturnValue({email:'valid@email.com'});
        jest.spyOn(handler, 'userExists').mockResolvedValue(true);
        //@ts-expect-error rough type coersion, need non-null value
        jest.spyOn(handler, 'getSession').mockResolvedValue(true);
        jest.spyOn(handler, 'isSameUser').mockReturnValue(false);
        jest.spyOn(handler, 'isAlreadyAdded').mockResolvedValue(false);
        jest.spyOn(handler, 'areAlreadyFriends').mockResolvedValue(true);
        const expected = {
            message:"You're already friends with this user",
            opts: { status: 400 }
        }
        await handler.isValidRequest({email:'example@example.com'});
        expect(handler.errorResponse()).toEqual(expected);
    })
});

describe("error response tests",()=>{
    let handler: PostFriendsRouteHandler

    beforeEach(()=>{
        handler = new PostFriendsRouteHandler()
    })

    afterEach(()=>{
        jest.resetAllMocks()
    })

    test("if validateEmail throws, then isValidRequest resolves false", async()=>{
        jest.spyOn(handler, 'validateEmail').mockImplementation(()=>{
            throw new Error('error');
        })

        const actual = await handler.isValidRequest({email:'stupid invalid email'});
        expect(actual).toEqual(false);
    })

    test("if userExists resolves to false, then isValid Request resolves false", async()=>{
        jest.spyOn(handler, 'validateEmail').mockReturnValue({email:'valid@email.com'});
        jest.spyOn(handler, 'userExists').mockResolvedValue(false);
        const actual = await handler.isValidRequest({email:'example@example.com'});
        expect(actual).toEqual(false);
    });

    test("if getSession resolves falsy, then isValidRequest resolves false", async()=>{
        jest.spyOn(handler, 'validateEmail').mockReturnValue({email:'valid@email.com'});
        jest.spyOn(handler, 'userExists').mockResolvedValue(true);
        //@ts-expect-error rough type coersion, need non-null value
        jest.spyOn(handler, 'getSession').mockResolvedValue(false);
        const actual = await handler.isValidRequest({email:'example@example.com'});
        expect(actual).toEqual(false);
    });

    test("if user attempts to add self, then isValidRequest resolves falsy", async()=>{
        jest.spyOn(handler, 'validateEmail').mockReturnValue({email:'valid@email.com'})
        jest.spyOn(handler, 'userExists').mockResolvedValue(true)
        //@ts-expect-error rough type coersion, need non-null value
        jest.spyOn(handler, 'getSession').mockResolvedValue(true)
        jest.spyOn(handler, 'isSameUser').mockReturnValue(true)
        const actual = await handler.isValidRequest({email:'example@example.com'})
        expect(actual).toEqual(false)
    })
    test("if the target is already added, then isValidRequest resolves falsy", async()=>{
        jest.spyOn(handler, 'validateEmail').mockReturnValue({email:'valid@email.com'})
        jest.spyOn(handler, 'userExists').mockResolvedValue(true)
        jest.spyOn(handler, 'getSession').mockResolvedValue(true)
        jest.spyOn(handler, 'isSameUser').mockReturnValue(false)
        jest.spyOn(handler, 'isAlreadyAdded').mockResolvedValue(true)
        const actual = await handler.isValidRequest({email:'example@example.com'})
        expect(actual).toEqual(false)
    })

    test("if the target and user are already friends, isValidRequest resolves false", async()=>{
        jest.spyOn(handler, 'validateEmail').mockReturnValue({email:'valid@email.com'})
        jest.spyOn(handler, 'userExists').mockResolvedValue(true)
        //@ts-expect-error rough type coersion, need non-null value
        jest.spyOn(handler, 'getSession').mockResolvedValue(true)
        jest.spyOn(handler, 'isSameUser').mockReturnValue(false)
        jest.spyOn(handler, 'isAlreadyAdded').mockResolvedValue(false)
        jest.spyOn(handler, 'areAlreadyFriends').mockResolvedValue(true)
        const actual = await handler.isValidRequest({email:'example@example.com'})
        expect(actual).toEqual(false)
    })
});

describe("IsAlreadyAddedTests", ()=>{
    let handler: PostFriendsRouteHandler

    beforeEach(()=>{
        handler = new PostFriendsRouteHandler();
    });

    afterEach(()=>{
        jest.resetAllMocks();
    });

    test('if isAlready Added is called, then fetchRedis is called with the command "sismember"',async ()=>{
        (fetchRedis as jest.Mock).mockResolvedValue('');
        await handler.isAlreadyAdded()
        expect(fetchRedis).toHaveBeenCalledWith('sismember',expect.anything(), expect.anything());
    })

    test('if the handler\'s addID is 1234, then isAlreadyAdded calls fetch with argument 1 == user:1234incoming_friend_requests'
        ,async ()=>{
        const addId = '1234';
        handler.idToAdd= addId;
        (fetchRedis as jest.Mock).mockResolvedValue('');
        await handler.isAlreadyAdded()
        expect(fetchRedis).toHaveBeenCalledWith(expect.anything(),`user:1234:incoming_friend_requests`, expect.anything() )
    });

    test('if the handler\'s addID is 4567, then isAlreadyAdded calls fetch with argument 1 == user:1234incoming_friend_requests'
        ,async ()=>{
            const addId = '4567';
            handler.idToAdd= addId;
            (fetchRedis as jest.Mock).mockResolvedValue('');
            await handler.isAlreadyAdded()
            expect(fetchRedis).toHaveBeenCalledWith(expect.anything(),`user:4567:incoming_friend_requests`, expect.anything() )
        });

    test('if the senderId  is 4567, then isAlreadyAdded calls fetch with argument 2 == 4567'
        ,async ()=>{
            handler.senderId= '4567';
            (fetchRedis as jest.Mock).mockResolvedValue('');
            await handler.isAlreadyAdded()
            expect(fetchRedis).toHaveBeenCalledWith(expect.anything(),expect.anything(), '4567')
        });

    test('if the senderId  is 1234, then isAlreadyAdded calls fetch with argument 2 == 1234'
        ,async ()=>{
            handler.senderId= '1234';
            (fetchRedis as jest.Mock).mockResolvedValue('');
            await handler.isAlreadyAdded()
            expect(fetchRedis).toHaveBeenCalledWith(expect.anything(),expect.anything(), '1234')
        });

})

describe("IsAlreadyAddedTests", ()=> {
    let handler: PostFriendsRouteHandler;

    beforeEach(() => {
        handler = new PostFriendsRouteHandler();
    });

    afterEach(()=>{
        jest.resetAllMocks();
    });

    test('if areAlreadyFriends is called, fetchRedis is called with command "sismember"', async () => {
        (fetchRedis as jest.Mock).mockResolvedValue('');
        await handler.areAlreadyFriends()
        expect(fetchRedis).toHaveBeenCalledWith('sismember', expect.anything(), expect.anything())
    });

    test('if handler.senderID == 6789, then fetchRedis is called with "user:6789:friends"', async () => {
        handler.senderId = '6789';
        (fetchRedis as jest.Mock).mockResolvedValue('');
        await handler.areAlreadyFriends();
        expect(fetchRedis).toHaveBeenCalledWith(expect.anything(),'user:6789:friends', expect.anything());
    });

    test('if handler.senderID == 0987, then fetchRedis is called with "user:6789:friends"', async () => {
        handler.senderId = '0987';
        (fetchRedis as jest.Mock).mockResolvedValue('');
        await handler.areAlreadyFriends();
        expect(fetchRedis).toHaveBeenCalledWith(expect.anything(),'user:0987:friends', expect.anything());
    });

    test('if handler.idToAdd == 0987, then fetchRedis is called with "0987"', async () => {
        handler.idToAdd = '0987';
        (fetchRedis as jest.Mock).mockResolvedValue('');
        await handler.areAlreadyFriends();
        expect(fetchRedis).toHaveBeenCalledWith(expect.anything(),expect.anything(), '0987');
    });

    test('if handler.idToAdd == 1234, then fetchRedis is called with "0987"', async () => {
        handler.idToAdd = '1234';
        (fetchRedis as jest.Mock).mockResolvedValue('');
        await handler.areAlreadyFriends();
        expect(fetchRedis).toHaveBeenCalledWith(expect.anything(),expect.anything(), '1234');
    });
})

describe("addToDB tests",()=>{
    let handler: PostFriendsRouteHandler;

    beforeEach(()=>{
        handler = new PostFriendsRouteHandler();
    });

    afterEach(()=>{
        jest.resetAllMocks();
    });

    test('if idToAdd = 234235, then addToDB calls db.sadd with "user:234235:incoming_friend_requests"',async ()=>{
        handler.idToAdd = '234235';
        await handler.addToDB();
        expect(db.sadd).toHaveBeenCalledWith( "user:234235:incoming_friend_requests", expect.anything());
    });

    test('if idToAdd = 86576435, then addToDB calls db.sadd with "user:86576435:incoming_friend_requests"',async ()=>{
        handler.idToAdd = '86576435';
        await handler.addToDB();
        expect(db.sadd).toHaveBeenCalledWith( "user:86576435:incoming_friend_requests", expect.anything());
    });

    test('if senderId = 86576435, then addToDB calls db.sadd with "user:86576435:incoming_friend_requests"',async ()=>{
        handler.senderId = '86576435';
        await handler.addToDB();
        expect(db.sadd).toHaveBeenCalledWith( expect.anything(), '86576435');
    });

    test('if senderId = 7662434, then addToDB calls db.sadd with "user:86576435:incoming_friend_requests"',async ()=>{
        handler.senderId = '7662434';
        await handler.addToDB();
        expect(db.sadd).toHaveBeenCalledWith( expect.anything(), '7662434');
    });
});

describe("isSameUserTests",()=>{
    let handler: PostFriendsRouteHandler;

    beforeEach(()=>{
        handler = new PostFriendsRouteHandler();
    })

    test("If idToAdd = 235346q3 and senderId = 235346q3, then isSameUser returns true",()=>{
        handler.idToAdd = '235346q3';
        handler.senderId = '235346q3';
        expect(handler.isSameUser()).toEqual(true);
    });

    test("if idToAdd = '235346q3' and senderID = '86576435', then isSameUser returns false",()=>{
        handler.idToAdd = '235346q3';
        handler.senderId ='86576435';
        expect(handler.isSameUser()).toEqual(false);
    });
});
