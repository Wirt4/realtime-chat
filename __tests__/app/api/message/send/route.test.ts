import {POST} from "@/app/api/message/send/route";
import myGetServerSession from "@/lib/myGetServerSession";

jest.mock("@/lib/myGetServerSession",()=> jest.fn());

describe('api/message/send tests', () => {
    let request: Request
    beforeEach(()=>{
        jest.resetAllMocks()
        request = new Request("/message/send", {
            method: "POST",
            body: "{\"chatId\": \"bar--foo\"}",
        });
    })
    test('If session is null, then return a 401 Unauthorized',async ()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue(null);
        const response = await POST(request)
        expect(response).toEqual(expect.objectContaining({status: 401, statusText: 'Unauthorized'}));
    })
    test('Is fine, do not 401 Unauthorized',async ()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: 'foo'}});
        const response = await POST(request)
        expect(response).not.toEqual(expect.objectContaining({status: 401, statusText: 'Unauthorized'}));
    })
    test('userid is not part of the chat, return 401 unauthorized',async ()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: 'foo'}});
        request= new Request("/message/send", {
            method: "POST",
            body: "{\"chatId\": \"alpha--beta\"}",
        });
        const response = await POST(request)
        expect(response).toEqual(expect.objectContaining({status: 401, statusText: 'Unauthorized'}));
    })
})
