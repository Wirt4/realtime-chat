import { MessageSendController} from "@/controllers/message/send/controller";
import myGetServerSession from "@/lib/myGetServerSession"
import {MessageSendInterface} from "@/services/message/interface";
jest.mock('@/lib/myGetServerSession')

describe('messageSendController.send test',()=>{
    let request: Request
    let controller: MessageSendController
    let service: MessageSendInterface
    beforeEach(()=>{
        jest.resetAllMocks();
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: 'foo'}});
        request = new Request("/message/send", {
            method: "POST",
            body: "{\"chatId\": \"bar--foo\",\"text\":\"hello\"}",
        });
        controller = new MessageSendController()
        service = {
            isChatMember: jest.fn().mockReturnValue(true),
            areFriends: jest.fn().mockResolvedValue(true),
            sendMessage: jest.fn()
        }
    })
    it('if session is unauthorized then status is 401', async ()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue(null);
        const response = await controller.send(request, service)
        expect(response.status).toBe(401)
    })
    it('if not 401 then session is not unauthorizied', async ()=>{
        const response = await controller.send(request, service)
        expect(response.status).not.toBe(401)
    })
    it('if session user is not part of the chat, return a 401', async ()=>{
        service.isChatMember = jest.fn().mockReturnValue(false)
        const response = await controller.send(request, service)
        expect(response.status).toBe(401)
    })
    it('if the session user and chat partner are not friends, return 401', async ()=>{
        service.areFriends = jest.fn().mockResolvedValue(false)
        const response = await controller.send(request, service)
        expect(response.status).toBe(401)
    })

    it('if service.sendMessage throws, return a 500 and the full error text', async ()=>{
        service.sendMessage = jest.fn().mockRejectedValue(new Error('error text'))
        const response = await controller.send(request, service)
        expect(response.status).toBe(500)
        expect(response?.body.toString()).toEqual('Error: error text')
    })
    it('confirm params passed to send message', async ()=>{
        const expectedProfile: ChatProfile = {id: 'bar--foo', sender: 'foo'}
        await controller.send(request, service)
        expect(service.sendMessage).toHaveBeenCalledWith(expectedProfile, 'hello', expect.anything(), expect.anything())
    })
})
