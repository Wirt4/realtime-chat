import {POST} from "@/app/api/friends/remove/route";
import fetchRedis from "@/helpers/redis";
import {getServerSession} from "next-auth";

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}));

jest.mock("@/helpers/redis")


describe('Functionality Tests', () => {
    beforeEach(()=>{
        jest.resetAllMocks();
        (getServerSession as jest.Mock).mockResolvedValue({user:{id: 'foo'}});
        (fetchRedis as jest.Mock).mockResolvedValue(true)
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

    test('Given that the request and server session are correct : When the endpoint is called, it fetchRedis is called with the arg "sismember"', async ()=>{
        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'1977'}});
        const request = new Request("/api/friends/remove",
            {
                method: "POST",
                body: JSON.stringify({ idToRemove: '1966' }),
                headers: { 'Content-Type': 'application/json' }
            });
        await POST(request)

        expect(fetchRedis as jest.Mock).toHaveBeenCalledWith('sismember');
    })

    test('Given that the request and server session are correct and fetchRedis is called with sisimember: When the endpoint is called, it fetchRedis is called with the parameter "user:1977:friends"', async ()=>{
        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'1977'}});
        const request = new Request("/api/friends/remove",
            {
                method: "POST",
                body: JSON.stringify({ idToRemove: '1966' }),
                headers: { 'Content-Type': 'application/json' }
            });
        await POST(request)

        expect(fetchRedis as jest.Mock).toHaveBeenCalledWith('sismember',"user:1977:friends");
    })
})
