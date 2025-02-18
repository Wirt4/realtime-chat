import { ChatProfileController } from "@/controllers/chatProfile/controller";
import myGetServerSession from "@/lib/myGetServerSession";
import { ChatProfileService } from "@/services/chatProfile/implementation";

jest.mock("@/services/chatProfile/implementation");
jest.mock("@/lib/myGetServerSession", () => jest.fn());

describe("get chat profile id from users tests", () => {
    let loadIdFromUsersSpy: jest.SpyInstance;
    let mockGetChatId: jest.SpyInstance
    beforeEach(() => {
        jest.resetAllMocks();
        loadIdFromUsersSpy = jest.fn();
        mockGetChatId = jest.fn();
        (myGetServerSession as jest.Mock).mockResolvedValue({ user: { id: 'userId' } });
        (ChatProfileService as jest.Mock).mockImplementation(() => ({
            loadProfileFromUsers: loadIdFromUsersSpy,
            getChatId: mockGetChatId,
        }));

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

        expect(result.status).toEqual(400);
    });

    it("if the request body is correctly formatted, then call the service method with a set of the participants", async () => {
        const controller = new ChatProfileController();
        const request = new Request("stub.address", { method: "POST", body: JSON.stringify({ participants: ["bob", "jay"] }) });

        await controller.getChatIdFromUsers(request);

        expect(loadIdFromUsersSpy).toHaveBeenCalledWith(new Set(["jay", "bob"]));
    });

    it("ouptuput of service call should be in the response body", async () => {
        const controller = new ChatProfileController();
        const request = new Request("stub.address", { method: "POST", body: JSON.stringify({ participants: ["bob", "jay"] }) });
        mockGetChatId.mockReturnValue("target-chat-id");

        const result = await controller.getChatIdFromUsers(request);

        expect(await result.json()).toEqual({ chatId: "target-chat-id" });
        expect(result.status).toEqual(200);
    })
});

describe("get profile tests", () => {
    let testId: string;
    let controller: ChatProfileController;
    let request: Request;
    let mockGetProfile: jest.Mock;
    beforeEach(() => {
        jest.resetAllMocks();
        testId = "111111111111111111111111111111111111--111111111111111111111111111111111111";
        controller = new ChatProfileController();
        request = new Request(`http://localhost:3000?id=${testId}`, { method: "GET" });
        (myGetServerSession as jest.Mock).mockResolvedValue({ user: { id: 'kappa' } });
        mockGetProfile = jest.fn().mockReturnValue({ id: testId, members: new Set(["user1", "user2"]) });
        (ChatProfileService as jest.Mock).mockImplementation(() => ({
            getProfile: mockGetProfile,
        }));

    })
    it("if method is not get, return 405", async () => {
        request = new Request(`http://localhost:3000?id=${testId}`, { method: "POST" });

        const result = await controller.getProfile(request);

        expect(result.status).toEqual(405);
    });
    it("if request does not have query param 'chatId'", async () => {
        request = new Request("http://localhost:3000", { method: "GET" });

        const result = await controller.getProfile(request);

        expect(result.status).toEqual(400);
    });
    it("if request has a correctly formatted chatID", async () => {
        const result = await controller.getProfile(request);

        expect(result.status).not.toEqual(400);
    });
    it("if request  query param 'chatId' is an empty string call 400", async () => {
        request = new Request("http://localhost:3000?id=", { method: "GET" });

        const result = await controller.getProfile(request);

        expect(result.status).toEqual(400);
    });
    it("if request query param 'chatId' is incorrectly formatted, return 400", async () => {
        request = new Request("http://localhost:3000?id=badformatting", { method: "GET" });

        const result = await controller.getProfile(request);

        expect(result.status).toEqual(400);
    });
    it("if the session is null, then return 401", async () => {
        (myGetServerSession as jest.Mock).mockResolvedValue(null);

        const result = await controller.getProfile(request);

        expect(result.status).toEqual(401);
    });
    it("if all checks pass, then pass the test ID to the service method getProfile", async () => {
        await controller.getProfile(request);

        expect(mockGetProfile).toHaveBeenCalledWith(testId);
    });
    it("if all checks pass, then return a response with key 'data'", async () => {
        const response = await controller.getProfile(request);
        expect(await response.json()).toEqual(expect.objectContaining({ data: expect.anything() }));
    });
    it("if the service returns null, then data is null", async () => {
        mockGetProfile.mockResolvedValue(null);
        const response = await controller.getProfile(request);
        expect(await response.json()).toEqual(expect.objectContaining({ data: null }));
    });
    it("if the service returns a profile, then data is is the equvialent of that profile", async () => {
        const response = await controller.getProfile(request);
        expect(await response.json()).toEqual(expect.objectContaining(
            { data: expect.objectContaining({ id: testId, members: expect.arrayContaining(['user1', 'user2']) }) }
        ));
    });
});
