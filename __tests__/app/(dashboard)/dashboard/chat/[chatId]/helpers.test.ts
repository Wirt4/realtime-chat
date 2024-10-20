import {Helpers} from "@/app/(dashboard)/dashboard/chat/[chatId]/helpers";
import {notFound} from "next/navigation";
import fetchRedis from "@/helpers/redis";
import {messageArraySchema} from "@/lib/validations/messages"

jest.mock("@/helpers/redis", () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    notFound: jest.fn(),
}));

describe('getChatMessage Tests', () => {
    let helpers: Helpers;
    beforeEach(() => {
        helpers = new Helpers();
        jest.spyOn(helpers, 'fetchChatById').mockResolvedValue(["{\"id\": \"1701\", \"senderId\": \"bob\", \"text\":\"Hello world. My name's Gypsy, what's yours?\", \"timestamp\":1729437427}"]);

    })

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('if fetchChatById throws, notFound is called', async () => {
        jest.spyOn(helpers, 'fetchChatById').mockRejectedValue('Bad')

        await helpers.getChatMessage("chat:userOne-userTwo:message");

        expect(notFound).toHaveBeenCalled();
    });

    test("if fetchRedis doesn't throw, notFound isn't called", async () => {
        await helpers.getChatMessage("chat:userOne-userTwo:message");

        expect(notFound).not.toHaveBeenCalled();
    });

    test('If getChatMessage is called, then messageArraySchema.parse is called with the output of fetchChat',async ()=>{
        jest.spyOn(helpers, "fetchChatById").mockResolvedValue(["{\"id\": \"1701\", \"senderId\": \"bob\", \"text\":\"Hello world. My name's Gypsy, what's yours?\", \"timestamp\":1729437427}"]);
        const validatorSpy = jest.spyOn(messageArraySchema, 'parse');

        await helpers.getChatMessage("chat:userOne-userTwo:message");

        expect(validatorSpy).toHaveBeenCalledWith([{id: '1701', senderId: 'bob', text:"Hello world. My name's Gypsy, what's yours?", timestamp:1729437427}]);
    })

    test('if fetchByChatId returns an array with the most recent timestamp first, then return the array reversed', async()=>{
        jest.spyOn(helpers, "fetchChatById").mockResolvedValue(["{\"id\": \"1701\", \"senderId\": \"bob\", \"recieverId\": \"1071\", \"text\":\"Hi Alice, what's up\", \"timestamp\":1729533949}",
            "{\"id\": \"1071\", \"senderId\": \"alice\", \"recieverId\":\"1701\", \"text\":\"Hi bob\", \"timestamp\":1729437427}"]);
        // @ts-expect-error rough mock for green parse
       jest.spyOn(messageArraySchema, 'parse').mockImplementation((arr)=>{return arr})
       const result =  await helpers.getChatMessage("chat:1071-1701:message");

       expect(result).toEqual([ {id: '1071', senderId: 'alice',recieverId:'1701', text:"Hi bob", timestamp:1729437427},{id: '1701', senderId: 'bob',recieverId: '1071', text:"Hi Alice, what's up", timestamp:1729533949}])
    })
});

describe('fetchChat Tests',()=>{
    let helpers: Helpers;

    beforeEach(() => {
        jest.resetAllMocks();
        (fetchRedis as jest.Mock).mockResolvedValue('Good');
        helpers = new Helpers();
    });

    test('if fetchChat is called, fetchRedis is called with argumenst of "zrange" a string 0, then -1', async () => {
        await helpers.fetchChatById('stub');
        expect(fetchRedis as jest.Mock).toHaveBeenCalledWith('zrange',expect.anything(), 0, -1);
    });

    test('if getChatMessage is called with chatid "userOne--userTwo", then fetRedis with called with the second argument as "chat:userOne-userTwo:message"', async()=>{
        await helpers.fetchChatById("userOne--userTwo");

        expect(fetchRedis as jest.Mock).toHaveBeenCalledWith(expect.anything(),"chat:userOne--userTwo:message", expect.anything(), expect.anything());
    });

    test('if fetchChatbyId is called with chatid "userOne--userTwo", then fetRedis with called with the second argument as "chat:userOne-userTwo:message"', async()=>{
        await helpers.fetchChatById("kirk--spock");

        expect(fetchRedis as jest.Mock).toHaveBeenCalledWith(expect.anything(),"chat:kirk--spock:message", expect.anything(), expect.anything());
    });
});
