import {RemoveFriendsController} from "@/controllers/friends/remove/controller";
import myGetServerSession from "@/lib/myGetServerSession";
import {RemoveFriendsServiceInterface} from "@/services/friends/interfaces";
jest.mock('@/lib/myGetServerSession')

describe('Functionality Tests', () => {
    let request: Request
    let controller: RemoveFriendsController
    let service: RemoveFriendsServiceInterface
    
    beforeEach(()=>{
        jest.clearAllMocks()
        request = new Request("/api/friends/remove",
            {
                method: "POST",
                body: JSON.stringify({ idToRemove: '1966' }),
                headers: { 'Content-Type': 'application/json' }
            }) as Request
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: 'foo'}});
        service = {
            areAlreadyFriends: jest.fn().mockResolvedValue(true)
        }
    })
    
    it("if the body isn't formatted correctly, return a 422", async () => {
        request = new Request("/api/friends/remove",
            {
                method: "POST",
                body: "",
                headers: { 'Content-Type': 'application/json' }
            }) as Request
        controller =  new RemoveFriendsController()
        const response = await controller.remove(request, service)
        expect(response.status).toBe(422)
        expect(response.body?.toString()).toEqual('Invalid Format')
    })


    it("if the body isn't formatted correctly, return a 422", async () => {
        controller =  new RemoveFriendsController()
        const response = await controller.remove(request, service)
        expect(response.status).not.toBe(422)
        expect(response.body?.toString()).not.toEqual('Invalid Format')
    })

    it('if the server session throws an error, return a 401', async () => {
        (myGetServerSession as jest.Mock).mockResolvedValue(null)
        const response = await controller.remove(request, service)
        expect(response.status).toBe(401)
    })
    it('service areAlreadyFriends returns true, so controller should return 400', async () => {
        service.areAlreadyFriends = jest.fn().mockResolvedValue(false)
        const response = await controller.remove(request, service)
        expect(response.status).toBe(400)
        expect(response.body?.toString()).toEqual('Not Friends')
    })
    it('service areAlreadyFriends returns false, so controller should return 400', async () => {
        const response = await controller.remove(request,service)
        expect(response.status).not.toBe(400)
        expect(response.body?.toString()).not.toEqual('Not Friends')
    })
})
