import {getPusherClient} from "@/lib/pusher";
import PusherClientHandler from "@/components/FriendRequests/helpers";

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
        const client = new PusherClientHandler('stub')
        client.subscribeToPusherClient()
        expect(subscribeSpy).toHaveBeenCalled();
    })

    test('if the sessionID is 12345, then subscribe is called with user:12345:incoming_friend_requests',()=>{
        const client = new PusherClientHandler('12345')
        client.subscribeToPusherClient()
        expect(subscribeSpy).toHaveBeenCalledWith('user__12345__incoming_friend_requests');
    })

    test('if the sessionID is 54321 , then subscribe is called with user:54321:incoming_friend_requests',()=>{
        const client = new PusherClientHandler('54321')
        client.subscribeToPusherClient()
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
        const client = new PusherClientHandler('stub')
        client.subscribeToPusherClient()
        expect(bindSpy).toHaveBeenCalled();
    })

    test('first argument to  PusherClient.bind should be "incoming_friend_requests"', ()=>{
        const client = new PusherClientHandler('stub')
        client.subscribeToPusherClient()
        expect(bindSpy).toHaveBeenCalledWith("incoming_friend_requests", expect.anything());
    })

    test('second argument to  PusherClient.bind should be the method friendRequestHandler', ()=>{
        const client = new PusherClientHandler('stub')
        client.subscribeToPusherClient()
        expect(bindSpy).toHaveBeenCalledWith(expect.anything(), client.friendRequestHandler);
    })
})

describe('subscribeToPusher tests, return value tests', ()=>{
    let subscribeSpy: jest.SpyInstance;
    let bindSpy: jest.SpyInstance;
    beforeEach(()=>{
        jest.resetAllMocks();
        subscribeSpy = jest.fn();
        bindSpy = jest.fn();
        (getPusherClient as jest.Mock).mockReturnValue({subscribe: subscribeSpy, bind: bindSpy});
    })
    test('the function returns the teardown method, which is a callable hook', ()=>{
        const client = new PusherClientHandler('stub')
        const actual = client.subscribeToPusherClient()
        expect(actual).toBe(client.tearDown)
    })
})
