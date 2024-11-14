import {POST} from "@/app/api/message/remove/all/route";

import {getServerSession} from "next-auth";
import {db} from "@/lib/db";

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}));

jest.mock("@/lib/db",()=>({
    __esModule: true,
    db: {
        zrem: jest.fn()
    }
}));

describe('Remove all messages', () => {
    beforeEach(()=>{
        jest.resetAllMocks();
    })
    test('Given the server session is invalid when the endpoint is called then it returns a 401',async ()=>{
        (getServerSession as jest.Mock).mockResolvedValue(null)

        const request = new Request("/api/message/remove/all",
            {
                method: "POST",
                body: JSON.stringify({ chatId: 'alpha--beta' }),
                headers: { 'Content-Type': 'application/json' }
            });

        const response = await POST(request)
        expect(response.status).toBe(401)
    })

    test('Given the chatId is missing from the payload, when the endpoint is called, then it returns a 422', async ()=>{
        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'stub'}})
        const request = new Request("/api/message/remove/all",
            {
                method: "POST",
                body: "{}",
                headers: { 'Content-Type': 'application/json' }
            });

        const response = await POST(request)
        expect(response.status).toBe(422)
    })

    test('Given the chatId is "alpha--beta" and the session id is "kappa", when the endpoint is called, then it returns a 401', async ()=>{
        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'kappa'}})
        const request = new Request("/api/message/remove/all",
            {
                method: "POST",
                body: JSON.stringify({chatId: "alpha--beta"}),
                headers: { 'Content-Type': 'application/json' }
            });

        const response = await POST(request)
        expect(response.status).toBe(401)
    })

    test('given the chatid is present but not formatted split by "--", when the endpoint is called, then it returns a 422', async ()=>{
        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'kappa'}})
        const request = new Request("/api/message/remove/all",
            {
                method: "POST",
                body: JSON.stringify({chatId: "kappa"}),
                headers: { 'Content-Type': 'application/json' }
            });

        const response = await POST(request)
        expect(response.status).toBe(422)
    })

    test('Given the checks are valid: when the endpoint is called with a chat id of "alpha--beta", then zrem is called with chat:alpha--beta:messages', async ()=>{
        (getServerSession as jest.Mock).mockResolvedValue({user:{id:'alpha'}})
        const request = new Request("/api/message/remove/all",
            {
                method: "POST",
                body: JSON.stringify({chatId: "alpha--beta"}),
                headers: { 'Content-Type': 'application/json' }
            });

       await POST(request)
       expect(db.zrem as jest.Mock).toHaveBeenCalledWith("chat:alpha--beta:messages");
    })
})
