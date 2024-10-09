import {POST} from "@/app/api/friends/add/route";
import {ResponseMock} from "../../../../__mocks__/ResponseMock";
import {addFriendValidator} from "@/lib/validations/add-friend";
import {z, ZodError, ZodIssueCode} from "zod";

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
    test('badly formatted email, zod throws, should return a 422', async ()=>{
        const issues: z.ZodIssue[] = [
            {
                code: ZodIssueCode.invalid_type,
                expected: "string",
                received: "number",
                path: ["name"],
                message: "Name must be a string",
            }
        ];
        const error = new ZodError(issues)
        jest.spyOn(addFriendValidator, 'parse').mockImplementation(()=>{
            throw error
        })
        const req = {
            body: {email: 'bad email'},
        } as unknown as Request;
        const response = await POST(req)
        const text = await  response.text()
        expect(response.status).toBe(422)
        expect(text).toBe('Invalid request payload')
    })
    test('Zod does not throw', async ()=>{
        const req = {
            body: {email:  'validemail@gmail.com'},
        } as unknown as Request;
        jest.spyOn(addFriendValidator, 'parse').mockReturnValue({email: 'validemail@gmail.com'})
        const response = await POST(req)
        const text = await  response.text()
        expect(response.status).not.toBe(422)
        expect(text).not.toBe('Invalid request payload')
    })
    test('unknown errorthrow', async ()=>{
        const req = {
            body: {email:  'validemail@gmail.com'},
        } as unknown as Request;
        jest.spyOn(addFriendValidator, 'parse').mockImplementation(()=>{
            throw new Error('unknown error')
        })
        const response = await POST(req)
        const text = await  response.text()
        expect(response.status).toBe(400)
        expect(text).toBe('Invalid request')
    })
})
