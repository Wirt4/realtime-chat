import {MessageSendController} from "@/controllers/message/send/messageSendController";
import myGetServerSession from "@/lib/myGetServerSession"
jest.mock('@/lib/myGetServerSession')

describe('messageSendController.send test',()=>{
    let request: Request
    let controller: MessageSendController
    beforeEach(()=>{
        jest.resetAllMocks();
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: 'foo'}});
        request = new Request("/message/send", {
            method: "POST",
            body: "{\"chatId\": \"bar--foo\",\"text\":\"hello\"}",
        });
        controller = new MessageSendController()
    })
    it('if session is unauthorized then status is 401', async ()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue(null);
        const response = await controller.send(request)
        expect(response.status).toBe(401)
    })
    it('if not 401 then session is not unauthorizied', async ()=>{
        const response =  await controller.send(request)
        expect(response.status).not.toBe(401)
    })
})
