import myGetServerSession from "@/lib/myGetServerSession";
import { AcceptFriendsController } from "@/controllers/friends/accept/controller";
import { aAcceptFriendsService } from "@/services/friends/accept/abstract";

jest.mock("@/lib/myGetServerSession", () => jest.fn());

describe('Accept Tests', () => {
    let request: Request;
    let controller: AcceptFriendsController;
    let result: Response;
    let service: aAcceptFriendsService;
    const idToAdd = 'idToAdd';
    const userId = 'userId';

    beforeEach(() => {
        request = {
            json: async () => ({ id: idToAdd })
        } as unknown as Request;
        (myGetServerSession as jest.Mock).mockResolvedValue({ user: { id: userId } });
        service = {
            store: jest.fn(),
            areFriends: jest.fn().mockResolvedValue(false),
            hasExistingRequest: jest.fn().mockResolvedValue(true),
            triggerEvent: jest.fn(),
        }
    });

    it("if there's no ID to add, then return a 422", async () => {
        request = {
            json: async () => ({})
        } as unknown as Request;
        controller = new AcceptFriendsController()
        result = await controller.acceptFriendRequest(request, service);
        expect(result.status).toEqual(422)
    });

    it("if there's a valid ID to add, then don't throw a 422", async () => {
        controller = new AcceptFriendsController()
        result = await controller.acceptFriendRequest(request, service);
        expect(result.status).not.toEqual(422)
    });

    it("if the userID is unauthorized to add, throw a 401", async () => {
        (myGetServerSession as jest.Mock).mockResolvedValue(null);
        controller = new AcceptFriendsController()
        result = await controller.acceptFriendRequest(request, service);
        expect(result.status).toEqual(401)
    });

    it('should call friendsService with ids', async () => {
        controller = new AcceptFriendsController()
        result = await controller.acceptFriendRequest(request, service);
        const ids: Ids = { sessionId: userId, requestId: idToAdd };
        expect(service.store).toHaveBeenCalledWith(ids);
    });

    it('if no errors, return a 200', async () => {
        controller = new AcceptFriendsController()
        result = await controller.acceptFriendRequest(request, service);
        expect(result.status).toEqual(200)
    });

    it('if handleFriendRequest throws an Already friends error, return a 400', async () => {
        service.areFriends = jest.fn().mockResolvedValue(true);
        controller = new AcceptFriendsController()
        result = await controller.acceptFriendRequest(request, service);
        expect(result.status).toEqual(400)
    });

    it('if handleFriendRequest throws a No Existing Friend Request error, return a 400', async () => {
        service.hasExistingRequest = jest.fn().mockResolvedValue(false);
        controller = new AcceptFriendsController()
        result = await controller.acceptFriendRequest(request, service);
        expect(result.status).toEqual(400)
    });
})
