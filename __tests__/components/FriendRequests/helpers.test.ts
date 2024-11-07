import subscribeToPusherClient from "@/components/FriendRequests/helpers";
import {getPusherClient} from "@/lib/pusher";

jest.mock("@/lib/pusher",()=>({
    getPusherClient: jest.fn()
}));

describe('subscribeToPusherClient tests', ()=>{
    let subscribeSpy: jest.SpyInstance;
    beforeEach(()=>{
        jest.resetAllMocks();
        subscribeSpy = jest.fn();
        (getPusherClient as jest.Mock).mockReturnValue({subscribe: subscribeSpy});
    })

    test('calling function should call PusherClient.subscribe', ()=>{
        subscribeToPusherClient();
        expect(subscribeSpy).toHaveBeenCalled();
    })

    test('if the sessionID is 12345, then subscribe is called with user:12345:incoming_friend_requests',()=>{
        subscribeToPusherClient();
        expect(subscribeSpy).toHaveBeenCalledWith('user:12345:incoming_friend_requests');
    })

    test('if the sessionID is 54321 , then subscribe is called with user:54321:incoming_friend_requests',()=>{
        subscribeToPusherClient();
        expect(subscribeSpy).toHaveBeenCalledWith('user:54321:incoming_friend_requests');
    })
})
