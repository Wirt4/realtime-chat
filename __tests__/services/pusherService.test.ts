import {PusherService} from "@/services/pusherService";
import PusherServer from "pusher";

describe('pusher service tests', () => {
    it('pusherService.trigger() should call the correct library functionality', ()=>{
        const mockClient = {
            trigger: jest.fn()
        }
        const pusher = new PusherService(mockClient as PusherServer)
        pusher.triggerPusher('bob', { userId: 'alice'})
        expect(mockClient.trigger).toHaveBeenCalledWith('user__bob__friends', "new_friend", { userId: 'alice'})
    })
})
