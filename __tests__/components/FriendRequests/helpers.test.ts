import subscribeToPusherClient from "@/components/FriendRequests/helpers";
import {getPusherClient} from "@/lib/pusher";
jest.mock("@/lib/pusher",()=>({
    getPusherClient: jest.fn()
}));

describe('subscribeToPusherClient tests', ()=>{
    test('calling function should call PusherClient.subscribe', ()=>{
        const subscribeSpy = jest.fn();
        (getPusherClient as jest.Mock).mockReturnValue({subscribe: subscribeSpy});
        subscribeToPusherClient()
        expect(subscribeSpy).toHaveBeenCalled();
    })
})
