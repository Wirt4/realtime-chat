import { GetMessageController } from "@/controllers/message/get/controller";
import myGetServerSession from "@/lib/myGetServerSession";

jest.mock("@/lib/myGetServerSession");
jest.mock("@/controllers/message/get/serviceFactory", jest.fn);

describe('messageGetController', () => {
    let testId: string;
    let request: Request;
    let controller: GetMessageController;
    let response: Response;
    let getMessagesMock: jest.Mock;
    let messages: Message[];
    let url: string

    beforeEach(() => {
        jest.resetAllMocks();
        url = 'http://localhost:3000';
        (myGetServerSession as jest.Mock).mockResolvedValue({ user: { id: 'kappa' } });
        testId = "sidmaksfwalrwams8sjfnakwej4vgy8sdv2w--8ansdkfanwjawf-0k2kas-asjfacvgte4567";
        request = new Request(`${url}/api/message/get?id=${testId}`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        });
        messages = [{
            senderId: "stub",
            receiverId: "bar",
            timestamp: 123,
            text: "Hello World"
        }]
        getMessagesMock = jest.fn(async () => messages);

        controller = new GetMessageController({ getMessages: getMessagesMock });
    });

    it('return 401 if server session is null', async () => {
        (myGetServerSession as jest.Mock).mockResolvedValue(null);
        response = await controller.execute(request);
        expect(response.status).toBe(401);
    });
    it('return 405 if method is not GET', async () => {
        request = new Request(`${url}/api/message/get?id=${testId}`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' }
        });
        response = await controller.execute(request);
        expect(response.status).toBe(405);
    });
    it('if all checks pass, then pass the chatId to the service', async () => {
        await controller.execute(request);
        expect(getMessagesMock).toHaveBeenCalledWith(testId);
    });
    it('if all checks pass, then result should have the data set to the array of messages', async () => {
        response = await controller.execute(request);
        expect(response.status).toBe(200);
        expect(await response.json()).toEqual(expect.objectContaining({ data: messages }));
    });
    it('if there is no query string, return 400', async () => {
        request = new Request(`${url}/api/message/get`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        });
        response = await controller.execute(request);
        expect(response.status).toBe(400);
    });
    it('if the chat id is ill-formatted, return 400', async () => {
        request = new Request(`${url}/api/message/get?id=badformatting`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        });
        response = await controller.execute(request);
        expect(response.status).toBe(400);
    });
});
