import {getServerSession} from "next-auth";
import {POST} from "@/app/api/message/remove/all/route";

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}));

describe('Remove all routes', () => {
    test('Given the server session is invalid when the endpoint is called then it returns a 401',async ()=>{
        (getServerSession as jest.Mock).mockResolvedValue(null)
        const response = await POST()
        expect(response.status).toBe(401)
    })
})
