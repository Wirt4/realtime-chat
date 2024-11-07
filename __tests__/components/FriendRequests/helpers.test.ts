import subscribeToPusherClient from "@/components/FriendRequests/helpers";
import {getPusherClient} from "@/lib/pusher";

jest.mock("@/lib/pusher",()=>({
    getPusherClient: jest.fn()
}));

describe('subscribeToPusherClient tests', ()=>{
    test('calling function should call PusherClient.subscribe', ()=>{
        const subscribeSpy = jest.fn();
        (getPusherClient as jest.Mock).mockReturnValue({subscribe: subscribeSpy});
        subscribeToPusherClient();
        expect(subscribeSpy).toHaveBeenCalled();
    })
    test('if the sessionID is 12345, then subscribe is called with user:12345:incoming_friend_requests',()=>{
        const subscribeSpy = jest.fn();
        (getPusherClient as jest.Mock).mockReturnValue({subscribe: subscribeSpy});
        subscribeToPusherClient();
        expect(subscribeSpy).toHaveBeenCalledWith('user:12345:incoming_friend_requests');
    })
})
