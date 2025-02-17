import { GetMessageController } from "@/controllers/message/get/controller";
import myGetServerSession from "@/lib/myGetServerSession";
import { GetMessagesInterface } from "@/services/message/interface";

jest.mock("@/lib/myGetServerSession");

describe('messageGetController', () => {
    it('return 401 if server session is null', async () => {
        (myGetServerSession as jest.Mock).mockResolvedValue(null);
        const testId = "sidmaksfwalrwams8sjfnakwej4vgy8sdv2w--8ansdkfanwjawf-0k2kas-asjfacvgte4567";
        const controller = new GetMessageController({ getMessages: jest.fn() });
        const request = new Request(`/api/message/get?id=${testId}`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        });
        const response = await controller.execute(request);
        expect(response.status).toBe(401);
    });

    it('if all checks pass, then pass the chatId to the service', async () => {
        (myGetServerSession as jest.Mock).mockResolvedValue({ user: { id: 'kappa' } });
        const testId = "sidmaksfwalrwams8sjfnakwej4vgy8sdv2w--8ansdkfanwjawf-0k2kas-asjfacvgte4567";
        const getMessagesMock = jest.fn()
        const mockService: GetMessagesInterface = { getMessages: getMessagesMock }
        const controller = new GetMessageController(mockService);
        const request = new Request(`/api/message/get?id=${testId}`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        });
        await controller.execute(request);


        expect(getMessagesMock).toHaveBeenCalledWith(testId, expect.anything());
    });
});
