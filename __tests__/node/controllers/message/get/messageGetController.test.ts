import { GetMessageController } from "@/controllers/message/get/controller";
import myGetServerSession from "@/lib/myGetServerSession";
import { GetMessagesInterface } from "@/services/message/interface";
import { get } from "http";

jest.mock("@/lib/myGetServerSession");

describe('messageGetController', () => {
    let testId: string;
    let request: Request;
    let controller: GetMessageController;
    let response: Response;
    let getMessagesMock: jest.Mock;
    beforeEach(() => {
        jest.resetAllMocks();
        (myGetServerSession as jest.Mock).mockResolvedValue({ user: { id: 'kappa' } });
        testId = "sidmaksfwalrwams8sjfnakwej4vgy8sdv2w--8ansdkfanwjawf-0k2kas-asjfacvgte4567";
        request = new Request(`/api/message/get?id=${testId}`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        });
        getMessagesMock = jest.fn();
        controller = new GetMessageController({ getMessages: getMessagesMock });
    })
    it('return 401 if server session is null', async () => {
        (myGetServerSession as jest.Mock).mockResolvedValue(null);
        response = await controller.execute(request);
        expect(response.status).toBe(401);
    });

    it('if all checks pass, then pass the chatId to the service', async () => {
        await controller.execute(request);

        expect(getMessagesMock).toHaveBeenCalledWith(testId, expect.anything());
    });
});
