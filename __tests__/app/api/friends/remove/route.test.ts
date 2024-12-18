import {POST} from "@/app/api/friends/remove/route";
import fetchRedis from "@/helpers/redis";
import {getServerSession} from "next-auth";
import {db} from "@/lib/db";
import axios from "axios";

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}));

jest.mock("@/helpers/redis")

jest.mock("@/lib/db",()=>({
    __esModule: true,
    db: {
        srem: jest.fn()
    }
}));

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Functionality Tests', () => {
    beforeEach(()=>{
        jest.resetAllMocks();
        (getServerSession as jest.Mock).mockResolvedValue({user:{id: 'foo'}});
        (fetchRedis as jest.Mock).mockResolvedValue(true);
        mockedAxios.post.mockImplementation(jest.fn());
    })

    test('Given that the endpoint accepts a parameter of {idToRemove: string}: When the endpoint is called with no body in the request, then it returns a 422 ', async ()=>{
        const request = new Request("/api/friends/remove",
            {
                method: "POST",
                body: "",
                headers: { 'Content-Type': 'application/json' }
            });
        const result = await POST(request)
        expect(result.status).toEqual(422)
    })

    test('Given that the endpoint accepts a parameter of {idToRemove: string}: When the endpoint is called with a correct request, then it does not return a 422 ', async ()=>{
        const request = new Request("/api/friends/remove",
            {
            method: "POST",
            body: JSON.stringify({ idToRemove: '1966' }),
                headers: { 'Content-Type': 'application/json' }
            });
        const result = await POST(request)
        expect(result.status).not.toEqual(422)
    })

    test('Given that the request is correct and server session resolves falsy: When the endpoint is called, then it returns a 401 ', async ()=>{
        (getServerSession as jest.Mock).mockResolvedValue(undefined)
        const request = new Request("/api/friends/remove",
            {
                method: "POST",
                body: JSON.stringify({ idToRemove: '1966' }),
                headers: { 'Content-Type': 'application/json' }
            });
        const result = await POST(request)
        expect(result.status).toEqual(401)
    })

    test('Given that the request is correct, server session resolves correctly and the session id and target id are not friends: When the endpoint is called, it returns a 400', async ()=>{
        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'1977'}});
        (fetchRedis as jest.Mock).mockResolvedValue(false)
        const request = new Request("/api/friends/remove",
            {
                method: "POST",
                body: JSON.stringify({ idToRemove: '1966' }),
                headers: { 'Content-Type': 'application/json' }
            });
        const result = await POST(request)
        expect(result.status).toEqual(400)
    })

    test('Given that the request and server session are correct and the session id is 1977 : When the endpoint is called with idToRemove: 1966, then fetchRedis is called with the parameters "sismember", "user:1977:friends", "1966"', async ()=>{
        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'1977'}});
        const request = new Request("/api/friends/remove",
            {
                method: "POST",
                body: JSON.stringify({ idToRemove: '1966' }),
                headers: { 'Content-Type': 'application/json' }
            });
        await POST(request)

        expect(fetchRedis as jest.Mock).toHaveBeenCalledWith('sismember',"user:1977:friends", "1966");
    })

    test('Given that the request and server session are correct and the session id is kirk: When the endpoint is called with idToRemove: spock, then fetchRedis is called with the parameters "sismember", "user:1977:friends", "1966"', async ()=>{
        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'kirk'}});
        const request = new Request("/api/friends/remove",
            {
                method: "POST",
                body: JSON.stringify({ idToRemove: 'spock' }),
                headers: { 'Content-Type': 'application/json' }
            });
        await POST(request)

        expect(fetchRedis as jest.Mock).toHaveBeenCalledWith('sismember',"user:kirk:friends", "spock");
    })

    test('Given that the request is valid and server session id is "kirk" and the ids are friends: When the endpoint is called with idToRemove: spock, then db.srem is called twice to remove entries from each friends list', async ()=>{
        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'kirk'}});
        const request = new Request("/api/friends/remove",
            {
                method: "POST",
                body: JSON.stringify({ idToRemove: 'spock' }),
                headers: { 'Content-Type': 'application/json' }
            });
        await POST(request)

        expect(db.srem as jest.Mock).toHaveBeenCalledWith("user:kirk:friends", "spock");
        expect(db.srem as jest.Mock).toHaveBeenCalledWith("user:spock:friends", "kirk");
    })

    test('Given that the request is valid and server session id is "john" and the ids are friends: When the endpoint is called with idToRemove: "paul", then db.srem is called twice to remove entries from each friends list', async ()=>{
        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'john'}});
        const request = new Request("/api/friends/remove",
            {
                method: "POST",
                body: JSON.stringify({ idToRemove: 'paul' }),
                headers: { 'Content-Type': 'application/json' }
            });
        await POST(request)

        expect(db.srem as jest.Mock).toHaveBeenCalledWith("user:john:friends", "paul");
        expect(db.srem as jest.Mock).toHaveBeenCalledWith("user:paul:friends", "john");
    })

    test('Given that the server session is truthy, the input is valid and both ids are friends: when the endpoint is called, then it returns a 200', async ()=>{
        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'john'}});
        (fetchRedis as jest.Mock).mockResolvedValue(true);
        const request = new Request("/api/friends/remove",
            {
                method: "POST",
                body: JSON.stringify({ idToRemove: 'paul' }),
                headers: { 'Content-Type': 'application/json' }
            });
        const response = await POST(request)
        expect(response.status).toEqual(200)
    })

    test('Given that the ids are not friends: When the endpoint is called, then db.srem is not called', async ()=>{
        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'kirk'}});
        (fetchRedis as jest.Mock).mockResolvedValue(false)
        const request = new Request("/api/friends/remove",
            {
                method: "POST",
                body: JSON.stringify({ idToRemove: 'spock' }),
                headers: { 'Content-Type': 'application/json' }
            });

        await POST(request)

        expect(db.srem as jest.Mock).not.toHaveBeenCalled();
    })
})
