import getFriendsByUserId from "@/helpers/getFriendsById"

import fetchRedis from "@/helpers/redis";
jest.mock("@/helpers/redis");

describe("getFriendsByUserId", () => {
    afterEach(()=>{
        jest.resetAllMocks();
    })
    test("if fetchRedis resolves to an empty array, then getFriendByUserId should resolve to an empty array",async ()=>{
        (fetchRedis as jest.Mock).mockResolvedValue([]);

        const actual = await getFriendsByUserId("1234");
        expect(actual).toEqual([]);
    });

    test("if one ID exists, then getFriendByUserId should resolve to an array of one",async ()=>{
        (fetchRedis as jest.Mock).mockImplementation(async (cmd: string, arg: string)=>{
            if (cmd == "smembers"){
                return ["1701"]
            }

            return  "{\"name\":\"bob\",\"email\": \"test.user@gmail.com\",\"image\":\"stub\",\"id\":\"1701\"}"
        });

        const actual = await getFriendsByUserId("1234");
        expect(actual).toEqual([ {
            name: "bob",
            email: "test.user@gmail.com",
            image: "stub",
            id: "1701",
        }]);
    });

    test("if multiple IDs exist, then getFriendByUserId should resolve to an array of one with the profiles matching those ids",async ()=>{
        (fetchRedis as jest.Mock).mockImplementation(async (cmd: string, arg: string)=>{
            if (cmd == "smembers"){
                return ["9177", "1701"]
            }

            const ids: {[key: string]: string }= {
                "user:9177": "{\"name\": \"alice\", \"email\": \"emailr@gmail.com\", \"image\": \"stub\", \"id\": \"9177\"}",
                "user:1701": "{\"name\": \"bob\", \"email\": \"test.user@gmail.com\", \"image\": \"stub\", \"id\": \"1701\"}"
            }
            return ids[arg]
        });

        const actual = await getFriendsByUserId("1234");

        expect(actual).toEqual(expect.arrayContaining([{
            name: "alice",
            email: "emailr@gmail.com",
            image: "stub",
            id: "9177",
        }]));
        expect(actual).toEqual(expect.arrayContaining([{
            name: "bob",
            email: "test.user@gmail.com",
            image: "stub",
            id: "1701",
        }]));
    });

    test("if multiple IDs exist, then getFriendByUserId should resolve to an array of one with the profiles matching those ids which match ids associated with the user",async ()=>{
        (fetchRedis as jest.Mock).mockImplementation(async (cmd: string, arg: string)=>{
            if (cmd === "smembers"){
                if (arg==="user:1234:friends") return ["9177", "1701"]
                return ["1812"]
            }

            const ids: {[key: string]: string }= {
                "user:9177": "{\"name\": \"alice\", \"email\": \"emailr@gmail.com\", \"image\": \"stub\", \"id\": \"9177\"}",
                "user:1701": "{\"name\": \"bob\", \"email\": \"test.user@gmail.com\", \"image\": \"stub\", \"id\": \"1701\"}",
                "user:1812":"{\"name\": \"mavis\", \"email\": \"test.user@gmail.com\", \"image\": \"stub\", \"id\": \"1812\"}"
            }
            return ids[arg]
        });

        const actual = await getFriendsByUserId("1234");

        expect(actual).not.toEqual(expect.arrayContaining([{
            name: "mavis",
            email: "test@test.com",
            image: "stub",
            id: "1812",
        }]));
    });

    test("if multiple IDs exist, then getFriendByUserId should resolve to an array of one with the profiles matching those ids which match ids associated with the user, different data",async ()=>{
        (fetchRedis as jest.Mock).mockImplementation(async (cmd: string, arg: string)=>{
            if (cmd === "smembers"){
                if (arg==="user:1812:friends") return ["9177"]
                return ["1701"]
            }

            const ids: {[key: string]: string }= {
                "user:9177": "{\"name\": \"alice\", \"email\": \"emailr@gmail.com\", \"image\": \"stub\", \"id\": \"9177\"}",
                "user:1701": "{\"name\": \"bob\", \"email\": \"test.user@gmail.com\", \"image\": \"stub\", \"id\": \"1701\"}",
            }
            return ids[arg]
        });

        const actual = await getFriendsByUserId("1812");

        expect(actual).not.toEqual(expect.arrayContaining([{
            name: "bob",
            email: "test.user@gmail.com",
            image: "stub",
            id: "1701",
        }]));
    });
});
