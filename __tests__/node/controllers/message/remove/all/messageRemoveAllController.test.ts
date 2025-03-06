import { MessageRemoveAllController } from "@/controllers/message/remove/all/controller";
import myGetServerSession from "@/lib/myGetServerSession";
import { POST } from "@/app/api/message/remove/all/route";
import { MessageRemoveAllInterface } from "@/services/message/interface";

jest.mock("@/lib/myGetServerSession")

describe('messageRemoveAllController', () => {
    let request: Request
    let controller: MessageRemoveAllController
    let response: Response
    let service: MessageRemoveAllInterface

    beforeEach(() => {
        (myGetServerSession as jest.Mock).mockResolvedValue({ user: { id: 'kappa' } });
        request = new Request("/api/message/remove/all",
            {
                method: "POST",
                body: JSON.stringify({ chatId: 'alpha--beta' }),
                headers: { 'Content-Type': 'application/json' }
            });
        controller = new MessageRemoveAllController();
        service = {
            isValidChatMember: jest.fn().mockReturnValue(true),
            deleteChat: jest.fn()
        }
    })
    it('return 401 if invalid', async () => {
        (myGetServerSession as jest.Mock).mockResolvedValue(null)
        response = await controller.removeAll(request, service)
        expect(response.status).toBe(401)
    })
    it('return 422 if chatId missing', async () => {
        request = new Request("/api/message/remove/all",
            {
                method: "POST",
                body: "{}",
                headers: { 'Content-Type': 'application/json' }
            });
        response = await controller.removeAll(request, service)
        expect(response.status).toBe(422)
    })
    it('return 401 if not part of chat', async () => {
        service.isValidChatMember = jest.fn().mockReturnValue(false)
        const response = await controller.removeAll(request, service)
        expect(response.status).toBe(401)
    })
    it("return 422 if chat id is not formatted correctly", async () => {
        (myGetServerSession as jest.Mock).mockResolvedValue({ user: { id: 'kappa' } });
        request = new Request("/api/message/remove/all",
            {
                method: "POST",
                body: JSON.stringify({ chatId: "kappa" }),
                headers: { 'Content-Type': 'application/json' }
            });

        const response = await controller.removeAll(request, service)
        expect(response.status).toBe(422)
    })
    it('return 200 if successful', async () => {
        response = await controller.removeAll(request, service)
        expect(response.status).toBe(200)
    })
    it('returns 500 if service throws', async () => {
        service.deleteChat = jest.fn().mockRejectedValue(new Error('error text'))
        response = await controller.removeAll(request, service)
        expect(response.status).toBe(500)
    })
})
