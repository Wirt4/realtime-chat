import {POST} from "@/app/api/friends/remove/route";

import {getServerSession} from "next-auth";

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}));


describe('Functionality Tests', () => {
    beforeEach(()=>{
        jest.resetAllMocks();
        (getServerSession as jest.Mock).mockResolvedValue({user:{id: 'foo'}})
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
})
