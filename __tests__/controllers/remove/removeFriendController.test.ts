import {FriendsRemoveController} from "@/controllers/friends/remove/controller";

describe('Functionality Tests', () => {
    let request: Request
    let controller: FriendsRemoveController
    let response: Response
    
    beforeEach(()=>{
        jest.clearAllMocks()
        request = new Request("/api/friends/remove",
            {
                method: "POST",
                body: JSON.stringify({ idToRemove: '1966' }),
                headers: { 'Content-Type': 'application/json' }
            });
    })
    
    it("if the body isn't formatted correctly, return a 422", async () => {
        request = new Request("/api/friends/remove",
            {
                method: "POST",
                body: "",
                headers: { 'Content-Type': 'application/json' }
            });
        controller =  new FriendsRemoveController()
        response = await controller.remove(request)
        expect(response.status).toBe(422)
        expect(response.body?.toString()).toEqual('Invalid Format')
    })


    it("if the body isn't formatted correctly, return a 422", async () => {
        request = new Request("/api/friends/remove",
            {
                method: "POST",
                body: JSON.stringify({ idToRemove: '1966' }),
                headers: { 'Content-Type': 'application/json' }
            });
        controller =  new FriendsRemoveController()
        response = await controller.remove(request)
        expect(response.status).not.toBe(422)
        expect(response.body?.toString()).not.toEqual('Invalid Format')
    })
})
