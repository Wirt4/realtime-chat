import subscribeToPusherClient from "@/components/FriendRequests/helpers";
import {getPusherClient} from "@/lib/pusher";

jest.mock("@/lib/pusher",()=>({
    getPusherClient: jest.fn()
}));

describe('subscribeToPusherClient tests, subscribe tests', ()=>{
    let subscribeSpy: jest.SpyInstance;
    let bindSpy: jest.SpyInstance;
    beforeEach(()=>{
        jest.resetAllMocks();
        subscribeSpy = jest.fn();
        bindSpy = jest.fn();
        (getPusherClient as jest.Mock).mockReturnValue({subscribe: subscribeSpy, bind: bindSpy});
    })

    test('calling function should call PusherClient.subscribe', ()=>{
        subscribeToPusherClient('stub');
        expect(subscribeSpy).toHaveBeenCalled();
    })

    test('if the sessionID is 12345, then subscribe is called with user:12345:incoming_friend_requests',()=>{
        subscribeToPusherClient('12345');
        expect(subscribeSpy).toHaveBeenCalledWith('user__12345__incoming_friend_requests');
    })

    test('if the sessionID is 54321 , then subscribe is called with user:54321:incoming_friend_requests',()=>{
        subscribeToPusherClient('54321');
        expect(subscribeSpy).toHaveBeenCalledWith('user__54321__incoming_friend_requests');
    })

})

describe('subscribeToPusher tests, bind tests', ()=>{
    let subscribeSpy: jest.SpyInstance;
    let bindSpy: jest.SpyInstance;
    beforeEach(()=>{
        jest.resetAllMocks();
        subscribeSpy = jest.fn();
        bindSpy = jest.fn();
        (getPusherClient as jest.Mock).mockReturnValue({subscribe: subscribeSpy, bind: bindSpy});
    })

    test('calling function should call PusherClient.bind', ()=>{
        subscribeToPusherClient('stub');
        expect(bindSpy).toHaveBeenCalled();
    })
})
