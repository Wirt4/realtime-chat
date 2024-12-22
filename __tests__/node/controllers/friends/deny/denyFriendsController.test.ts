import {DenyFriendsController} from "@/controllers/friends/deny/controller";
import myGetServerSession from "@/lib/myGetServerSession";
import {DenyFriendsServiceInterface} from "@/services/friends/interfaces";
jest.mock("@/lib/myGetServerSession",()=> jest.fn());

describe('Deny Tests',()=>{
    let controller: DenyFriendsController
    let service: DenyFriendsServiceInterface
    let request: Request
    beforeEach(()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id:'userId'}});
        controller = new DenyFriendsController()
        service ={
            removeEntry: jest.fn()
        }
        request = new Request('/api/friends/deny', {
            method: 'POST',
            body: JSON.stringify({ id: 'validID' }),
            headers: { 'Content-Type': 'application/json' }
        });
    })
    it('should return a 401 if the server session is falsy', async () => {
        (myGetServerSession as jest.Mock).mockResolvedValue(null);
        const result = await controller.deny(request, service)
        expect(result.status).toEqual(401)
    });
    it('should not return a 401 if the server session is truthy', async () => {
        const result = await controller.deny(request, service)
        expect(result.status).not.toEqual(401)
    });
    it('should return a 422 if the request session is truthy', async () => {
        request = new Request('/api/friends/deny', {
            method: 'POST',
            body: 'non-formatted string',
            headers: { 'Content-Type': 'application/json' }
        });
        const result = await controller.deny(request, service)
        expect(result.status).toEqual(422)
        expect(result.body?.toString()).toEqual('Invalid Request Payload');
    })
    it('should not return a 422 if the request session is truthy', async () => {
        const result = await controller.deny(request, service)
        expect(result.status).not.toEqual(422)
    })
    it('the removal service throws',async ()=>{
        service.removeEntry = jest.fn().mockRejectedValue("Redis Error")
        const result = await controller.deny(request, service)
        expect(result.status).toEqual(424)
        expect(result.body?.toString()).toEqual("Redis Error")
    })
    it('the removal service resolves',async ()=>{
        const result = await controller.deny(request, service)
        expect(result.status).toEqual(200)
    })
    it('the removal service is called with the correct arguments',async ()=>{
        await controller.deny(request, service)
        expect(service.removeEntry).toHaveBeenCalledWith({userId:'userId', toRemove: 'validID'}, expect.anything(), expect.anything())
    })
    it('if the pusher trigger fails, the response is  424',async ()=>{
        service.removeEntry = jest.fn().mockRejectedValue("Pusher Error")
        const result = await controller.deny(request, service)
        expect(result.status).toEqual(424)
        expect(result.body?.toString()).toEqual('Pusher Error');
    })
})
