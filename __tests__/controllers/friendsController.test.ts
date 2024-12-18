import {FriendsController} from "@/controllers/friendController";
import {FriendRequestStatus, FriendsService} from "@/services/friendsService";
import myGetServerSession from "@/lib/myGetServerSession";
jest.mock("@/lib/myGetServerSession",()=> jest.fn());

describe('friendsController tests',()=>{
    let request: Request;
    let controller: FriendsController
    let result: any
    let mockService: any
    const idToAdd = 'idToAdd'
    const userId = 'userId'
    beforeEach(()=>{
        request = {
            json: async () => ({ id: idToAdd })
        } as unknown as Request;
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: userId}});
        mockService = {handleFriendRequest: jest.fn().mockImplementation(()=>{})}
    })
    it("if there's no ID to add, then return a 422", async()=>{
        request = {
            json: async () => ({})
        } as unknown as Request;
         controller = new FriendsController(mockService as FriendsService)
        result = await controller.acceptFriendRequest(request);
        expect(result.status).toEqual(422)
    })
    it("if there's a valid ID to add, then don't throw a 422", async()=>{
        controller = new FriendsController(mockService as FriendsService)
         result = await controller.acceptFriendRequest(request);
        expect(result.status).not.toEqual(422)
    })
    it("if the userID is unauthorized to add, throw a 401", async()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue(null);
        controller = new FriendsController(mockService as FriendsService)
        result = await controller.acceptFriendRequest(request);
        expect(result.status).toEqual(401)
    })
    it('should call friendsService with ids', async () => {
        controller = new FriendsController(mockService as FriendsService)
        result = await controller.acceptFriendRequest(request);
        expect(mockService.handleFriendRequest).toHaveBeenCalledWith({toAdd: idToAdd, userId}, expect.anything(), expect.anything())
    });
    it ('if no errors, return a 200', async()=>{
        controller = new FriendsController(mockService as FriendsService)
        result = await controller.acceptFriendRequest(request);
        expect(result.status).toEqual(200)
    })
    it('if handleFriendRequest throws an Already Friends error, return a 400', async()=>{
        mockService.handleFriendRequest.mockRejectedValue(FriendRequestStatus.AlreadyFriends)
        controller = new FriendsController(mockService as FriendsService)
        result = await controller.acceptFriendRequest(request);
        expect(result.status).toEqual(400)
    })
    it('if handleFriendRequest throws a No Existing Friend Request error, return a 400', async()=>{
        mockService.handleFriendRequest.mockRejectedValue(FriendRequestStatus.NoExistingFriendRequest)
        controller = new FriendsController(mockService as FriendsService)
        result = await controller.acceptFriendRequest(request);
        expect(result.status).toEqual(400)
    })
    it('if handleFriendRequest throws an unknown error, return a 500', async()=>{
        mockService.handleFriendRequest.mockRejectedValue({message:'random error'})
        controller = new FriendsController(mockService as FriendsService)
        result = await controller.acceptFriendRequest(request);
        expect(result.status).toEqual(500)
    })
})
