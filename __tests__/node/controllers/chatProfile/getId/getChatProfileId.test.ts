import { ChatProfileController } from "@/controllers/chatProfile/controller";
import myGetServerSession from "@/lib/myGetServerSession";
jest.mock("@/lib/myGetServerSession", () => jest.fn());

describe("get chat profile id from users tests", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        (myGetServerSession as jest.Mock).mockResolvedValue({ user: { id: 'userId' } });
    });
    it("method 'getChatIdFromUsers'", async () => {
        const controller = new ChatProfileController();

        await controller.getChatIdFromUsers(new Request(""));

        expect(myGetServerSession as jest.Mock).toHaveBeenCalled();
    });

    it("if the session is null, return a 401'", async () => {
        (myGetServerSession as jest.Mock).mockResolvedValue(null);
        const controller = new ChatProfileController();

        const result = await controller.getChatIdFromUsers(new Request(""));

        expect(result.status).toEqual(401);
    });

    it("if the request body isnt formatted, return a 405", async () => {
        const controller = new ChatProfileController();
        const request = new Request("stub.address", { method: "POST", body: "missing properties" });

        const result = await controller.getChatIdFromUsers(request);

        expect(result.status).toEqual(405);
    });
});
