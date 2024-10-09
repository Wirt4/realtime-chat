import {POST} from "@/app/api/friends/add/route";
import {ResponseMock} from "../../../../__mocks__/ResponseMock";

describe('/api/friends/add', () => {
    let response : Response
    beforeAll( () => {
        response = global.Response

        // @ts-expect-error smaller set of features for mocking
        global.Response  =  ResponseMock
    })
    afterAll(()=>{
        //@ts-expect-error a bit blunt to get the mock restored when done
        global.Response = response
    })
    test('badly formatted email, should return a 422', async ()=>{
        const req = {
            body: {email: 'bad email'},
        } as unknown as Request;
        const response = await POST(req)
        const text = await  response.text()
        expect(response.status).toBe(422)
        expect(text).toBe('Invalid request payload')
    })

})