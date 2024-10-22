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

describe('test getChatMessage for 404 cases',()=>{
    let helpers: Helpers;
    beforeEach(() => {
        helpers = new Helpers();
        const userPayload = "{\"id\": \"1701\", \"senderId\": \"bob\", \"text\":\"Hello world. My name's Gypsy, what's yours?\", \"timestamp\":1729437427}"
        jest.spyOn(helpers, 'fetchChatById').mockResolvedValue([userPayload]);

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
});

describe('confirm getChatMessage is called with the output of fetchChatById', () => {
    let helpers: Helpers;
    beforeEach(() => {
        helpers = new Helpers();
        const userPayload = "{\"id\": \"1701\", \"senderId\": \"bob\", \"text\":\"Hello world. My name's Gypsy, what's yours?\", \"timestamp\":1729437427}"
        jest.spyOn(helpers, 'fetchChatById').mockResolvedValue([userPayload]);

    })

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('data set one',async ()=>{
        jest.spyOn(helpers, "fetchChatById").mockResolvedValue(["{\"id\": \"1701\", \"senderId\": \"bob\", \"text\":\"Hello world. My name's Gypsy, what's yours?\", \"timestamp\":1729437427}"]);
        const validatorSpy = jest.spyOn(messageArraySchema, 'parse');

        await helpers.getChatMessage("chat:userOne-userTwo:message");

        expect(validatorSpy).toHaveBeenCalledWith([{id: '1701', senderId: 'bob', text:"Hello world. My name's Gypsy, what's yours?", timestamp:1729437427}]);
    });

    test('data set two',async ()=>{
        jest.spyOn(helpers, "fetchChatById").mockResolvedValue(["{\"id\": \"1701\", \"senderId\": \"bob\", \"text\":\"Captain, you're being hailed\", \"timestamp\":1729437427}"]);
        const validatorSpy = jest.spyOn(messageArraySchema, 'parse');

        await helpers.getChatMessage("chat:userOne-userTwo:message");

        expect(validatorSpy).toHaveBeenCalledWith([{id: '1701', senderId: 'bob', text:"Captain, you're being hailed", timestamp:1729437427}]);
    });
});

describe('fetchByChatId returns an array with the most recent timestamp first,so onfirm getChatMessage returns items in correct order', () => {
    let helpers: Helpers;
    beforeEach(() => {
        helpers = new Helpers();
        const userPayload = "{\"id\": \"1701\", \"senderId\": \"bob\", \"text\":\"Hello world. My name's Gypsy, what's yours?\", \"timestamp\":1729437427}"
        jest.spyOn(helpers, 'fetchChatById').mockResolvedValue([userPayload]);

    })

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('data set one', async()=>{
        const fetchedData = [
            "{\"id\": \"1701\", \"senderId\": \"bob\", \"recieverId\": \"1071\", \"text\":\"Hi Alice, what's up\", \"timestamp\":1729533949}",
            "{\"id\": \"1071\", \"senderId\": \"alice\", \"recieverId\":\"1701\", \"text\":\"Hi bob\", \"timestamp\":1729437427}"
        ]
        jest.spyOn(helpers, "fetchChatById").mockResolvedValue(fetchedData);
        jest.spyOn(messageArraySchema, 'parse').mockImplementation((data: unknown) => {
           return data as { id: string; senderId: string; recieverId: string; text: string; timestamp: number }[];
        });

       const result =  await helpers.getChatMessage("chat:1071-1701:message");

       expect(result).toEqual([ {id: '1071', senderId: 'alice',recieverId:'1701', text:"Hi bob", timestamp:1729437427},{id: '1701', senderId: 'bob',recieverId: '1071', text:"Hi Alice, what's up", timestamp:1729533949}])
    });

    test('data set two', async()=>{
        const fetchedData = [
            "{\"id\": \"1701\", \"senderId\": \"bob\", \"recieverId\": \"1071\", \"text\":\"Hi Alice, what's up\", \"timestamp\":1729533949}",
            "{\"id\": \"1071\", \"senderId\": \"alice\", \"recieverId\":\"1701\", \"text\":\"Hi bob\", \"timestamp\":1729437427}",
            "{\"id\": \"1071\", \"senderId\": \"alice\", \"recieverId\":\"1701\", \"text\":\"Hey, it's 1970\", \"timestamp\":0}"
        ]
        jest.spyOn(helpers, "fetchChatById").mockResolvedValue(fetchedData);
        jest.spyOn(messageArraySchema, 'parse').mockImplementation((data: unknown) => {
            return data as { id: string; senderId: string; recieverId: string; text: string; timestamp: number }[];
        });

        const result =  await helpers.getChatMessage("chat:1071-1701:message");

        expect(result).toEqual([
            {id:'1071', senderId: 'alice', recieverId:"1701", text:"Hey, it's 1970", timestamp: 0},
            {id: '1071', senderId: 'alice',recieverId:'1701', text:"Hi bob", timestamp:1729437427},
            {id: '1701', senderId: 'bob',recieverId: '1071', text:"Hi Alice, what's up", timestamp:1729533949}
        ])
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
