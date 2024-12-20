
import {ServiceFriendsAdd} from "@/services/friends/serviceFriendsAdd";
import myGetServerSession from "@/lib/myGetServerSession";
import {AddFriendsController} from "@/controllers/friends/addFriendsController";
jest.mock("@/lib/myGetServerSession",()=> jest.fn());

describe('Add Tests',()=>{
    let mockService:ServiceFriendsAdd
    let controller: AddFriendsController
    const userId = 'foo'
    const idToAdd = 'bar'
    beforeEach(()=>{
        jest.clearAllMocks()
        mockService = {
            handleFriendAdd: jest.fn().mockImplementation(()=>{}),
            userExists: jest.fn().mockResolvedValue(true),
            isSameUser: jest.fn().mockReturnValue(false),
            isAlreadyAddedToFriendRequests: jest.fn().mockResolvedValueOnce(false),
            getIdToAdd: jest.fn().mockResolvedValue(idToAdd),
            areAlreadyFriends: jest.fn().mockResolvedValue(false)
        } as ServiceFriendsAdd
        controller = new AddFriendsController(mockService as ServiceFriendsAdd);
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: userId}})
    })
    it('should call service handleFriendAdd', async () => {
        await controller.addFriendRequest({json: async () => ({email: 'test@test.com'})} as unknown as Request, mockService)
        expect(mockService.handleFriendAdd).toHaveBeenCalled()
    })
    it('if the email in the request body is invalid, return a 422', async () => {
        const response = await controller.addFriendRequest({json: async () => ({})} as unknown as Request, mockService)
        expect(response.status).toEqual(422)
    })
    it('if the email in the request body is valid, do not return a 422', async () => {
        const response = await controller.addFriendRequest({json: async () => ({email: 'test@test.com'})} as unknown as Request, mockService)
        expect(response.status).not.toEqual(422)
    })
    it('if the user does not exist, return a 400', async () => {
        mockService.userExists = jest.fn().mockResolvedValue(false)
        controller = new AddFriendsController(mockService as ServiceFriendsAdd);
        const response = await controller.addFriendRequest({json: async () => ({email: 'test@test.com'})} as unknown as Request, mockService)
        expect(response.status).toEqual(400)
    })
    it('return 401 if the session is bad', async () => {
        (myGetServerSession as jest.Mock).mockResolvedValue(null);
        const response = await controller.addFriendRequest({json: async () => ({email: 'test@test.com'})} as unknown as Request, mockService)
        expect(response.status).toEqual(401)
    })
    it('return 400 if the user tries to add themselves', async () => {
        mockService.isSameUser = jest.fn().mockResolvedValue(true)
        controller = new AddFriendsController(mockService as ServiceFriendsAdd);
        const response = await controller.addFriendRequest({json: async () => ({email: 'test@test.com'})} as unknown as Request, mockService)
        expect(response.status).toEqual(400)
        expect(mockService.isSameUser).toHaveBeenCalledWith({userId: userId, toAdd: idToAdd})
    })
    it('return 400 if the target is already added',async ()=>{
        mockService.isAlreadyAddedToFriendRequests =  jest.fn().mockResolvedValueOnce(true)
        controller = new AddFriendsController(mockService as ServiceFriendsAdd);
        const response = await controller.addFriendRequest({json: async () => ({email: 'test@test.com'})} as unknown as Request, mockService)
        expect(response.status).toEqual(400)
    })
    it('if user is already friends with target, return 400', async () => {
        mockService.isAlreadyAddedToFriendRequests = jest.fn().mockResolvedValueOnce(false)
        mockService.handleFriendAdd = jest.fn()
        mockService.areAlreadyFriends = jest.fn().mockResolvedValue(true)
        controller = new AddFriendsController(mockService as ServiceFriendsAdd);
        const response = await controller.addFriendRequest({json: async () => ({email: 'test@test.com'})} as unknown as Request, mockService)
        expect(response.status).toEqual(400)
    })
})
