import myGetServerSession from "@/lib/myGetServerSession";
import {AddFriendsController} from "@/controllers/friends/add/controller";
import {AddFriendsServiceInterface} from "@/services/friends/interfaces";
import {IAddFriendsService} from "@/services/friends/add/interface";
jest.mock("@/lib/myGetServerSession",()=> jest.fn());

describe('Add Tests',()=>{
    let controller: AddFriendsController
    let request: Request
    const userId = 'foo'
    const idToAdd = 'bar'
    const email = 'test@test.com'
    let service: IAddFriendsService
    beforeEach(()=>{
        jest.clearAllMocks()
        service = {
            handleFriendAdd: jest.fn(),
            getIdToAdd: jest.fn().mockResolvedValue(idToAdd),
            isSameUser: jest.fn().mockReturnValue(false),
            isAlreadyAddedToFriendRequests: jest.fn().mockResolvedValueOnce(false),
            userExists: jest.fn().mockResolvedValue(true),
            areAlreadyFriends: jest.fn().mockResolvedValue(false)
        }
        controller = new AddFriendsController();
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: userId}})
        request = {json: async () => ({email: email})} as unknown as Request
    })
    it('should call service handleFriendAdd', async () => {
        await controller.addFriendRequest(request, service)
        expect(service.handleFriendAdd).toHaveBeenCalled()
    })
    it('if the email in the request body is invalid, return a 422', async () => {
        request={json: async () => ({})} as unknown as Request
        const response = await controller.addFriendRequest(request, service)
        expect(response.status).toEqual(422)
    })
    it('if the email in the request body is valid, do not return a 422', async () => {
        const response = await controller.addFriendRequest(request, service)
        expect(response.status).not.toEqual(422)
    })
    it('if the user does not exist, return a 400', async () => {
        service.userExists = jest.fn().mockResolvedValue(false)
        const response = await controller.addFriendRequest(request, service)
        expect(response.status).toEqual(400)
    })
    it('userExists should be called with the email in the request body', async () => {
        await controller.addFriendRequest(request, service)
        expect(service.userExists).toHaveBeenCalledWith(email)
    })
    it('return 401 if the session is bad', async () => {
        (myGetServerSession as jest.Mock).mockResolvedValue(null);
        const response = await controller.addFriendRequest(request, service)
        expect(response.status).toEqual(401)
    })
    it('return 400 if the user tries to add themselves', async () => {
        service.isSameUser = jest.fn().mockResolvedValue(true)
        const response = await controller.addFriendRequest(request, service)
        const ids: Ids = {sessionId: userId, requestId: idToAdd}
        expect(response.status).toEqual(400)
        expect(service.isSameUser).toHaveBeenCalledWith(ids)
    })
    it('return 400 if the target is already added',async ()=>{
        service.isAlreadyAddedToFriendRequests =  jest.fn().mockResolvedValueOnce(true)
        const response = await controller.addFriendRequest(request, service)
        expect(response.status).toEqual(400)
    })
    it('if user is already friends with target, return 400', async () => {
        service.isAlreadyAddedToFriendRequests = jest.fn().mockResolvedValueOnce(false)
        service.areAlreadyFriends = jest.fn().mockResolvedValue(true)
        const response = await controller.addFriendRequest(request, service)
        expect(response.status).toEqual(400)
    })
})
