
import {POST} from "@/app/api/friends/remove/route";
jest.mock("@/lib/db");

describe('Functionality Tests', () => {
    test('Given that the endpoint accepts a parameter of {idToRemove: string}: When the endpoint is called with no body in the request, then it returns a 422 ', async ()=>{
        const request = new Request('/api/friends/remove')
        const result = await POST(request)
        expect(result.status).toEqual(422)
    })
})
