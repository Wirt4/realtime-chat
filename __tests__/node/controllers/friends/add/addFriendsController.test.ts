import myGetServerSession from "@/lib/myGetServerSession";
import { AddFriendsController } from "@/controllers/friends/add/controller";
import { aAddFriendService } from "@/services/friends/add/abstract";
jest.mock("@/lib/myGetServerSession", () => jest.fn());

describe('Add Tests', () => {
    let controller: AddFriendsController;
    let request: Request;
    const userId = 'foo';
    const idToAdd = 'bar';
    const email = 'test@test.com';
    let service: aAddFriendService;

    beforeEach(() => {
        jest.clearAllMocks()
        service = {
            storeFriendRequest: jest.fn(),
            getIdToAdd: jest.fn().mockResolvedValue(idToAdd),
            triggerEvent: jest.fn()
        }
        controller = new AddFriendsController();
        (myGetServerSession as jest.Mock).mockResolvedValue({ user: { id: userId } })
        request = { json: async () => ({ email: email }) } as unknown as Request
    });

    it('should call service handleFriendAdd', async () => {
        await controller.addFriendRequest(request, service)
        expect(service.storeFriendRequest).toHaveBeenCalled()
    });

    it('return 401 if the session is bad', async () => {
        (myGetServerSession as jest.Mock).mockResolvedValue(null);
        const response = await controller.addFriendRequest(request, service)
        expect(response.status).toEqual(401)
    });
})
