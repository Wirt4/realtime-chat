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
            acceptFriendRequest: jest.fn(),
            getIdToAdd: jest.fn().mockReturnValue(idToAdd),
            triggerEvent: jest.fn(),
        }
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
        expect(service.acceptFriendRequest).toHaveBeenCalledWith(ids);
    });

    it('if no errors, return a 200', async () => {
        controller = new AcceptFriendsController()
        result = await controller.acceptFriendRequest(request, service);
        expect(result.status).toEqual(200)
    });
})
