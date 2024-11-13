import PusherClientHandler from "@/components/friendRequestSidebarOptions/helpers";
import {getPusherClient} from "@/lib/pusher";

jest.mock("@/lib/pusher",()=>({
    getPusherClient: jest.fn()
}));

describe('PusherClientHandler tests', () => {
    let subscribeSpy: jest.SpyInstance;
    let bindSpy: jest.SpyInstance;
    let client: PusherClientHandler;

    beforeEach(()=>{
        jest.resetAllMocks();
        bindSpy = jest.fn();
        subscribeSpy = jest.fn(()=>{return {bind: bindSpy}});
        (getPusherClient as jest.Mock).mockReturnValue({subscribe: subscribeSpy});
        client = new PusherClientHandler('stub_id', 0)
    })

    test("Given ordinary circumstance: when subscribeToPusher is called, then the pusher clients subscribe Method is called", ()=>{
        client.subscribeToPusher(jest.fn())
        expect(subscribeSpy).toHaveBeenCalled();
    })

    test('Given sessionID is 12345: When the method is called, then subscribe is called with user__12345__friends',()=>{
        client = new PusherClientHandler('12345', 0)
        client.subscribeToPusher(jest.fn())
        expect(subscribeSpy).toHaveBeenCalledWith('user__12345__friends');
    })

    test('Given sessionID is 12345: When the method is called, then subscribe is called with user__54321__friends',()=>{
        client = new PusherClientHandler('54321', 0)
        client.subscribeToPusher(jest.fn())
        expect(subscribeSpy).toHaveBeenCalledWith('user__54321__friends');
    })

    test('Given the sessionID is 12345, When the method is called, then subscribe is called with user__12345__incoming_friend_requests',()=>{
        client = new PusherClientHandler('12345', 0)
        client.subscribeToPusher(jest.fn())
        expect(subscribeSpy).toHaveBeenCalledWith('user__12345__incoming_friend_requests');
    })

    test('Given that the sessionID is 54321, when subscribeToPusher is run, then subscribe is called with user:12345:incoming_friend_requests',()=>{
        const client = new PusherClientHandler('54321', 0)
        client.subscribeToPusher(jest.fn())
        expect(subscribeSpy).toHaveBeenCalledWith('user__54321__incoming_friend_requests')
    })
})


describe('PusherClientHandler incrementCount tests', () => {
    let client: PusherClientHandler;
    let setterSpy: jest.Mock
    beforeEach(()=>{
        setterSpy = jest.fn()
    })

    test('the existing count is 1, so 2 is passed to the setter',()=>{
        client = new PusherClientHandler('stub_id', 1)
        const func = client.incrementCount(setterSpy)
        func()
        expect(setterSpy).toHaveBeenCalledWith(2)
    })

    test('the existing count is 8, so 9 is passed to the setter',()=>{
        client = new PusherClientHandler('stub_id', 8)
        const func = client.incrementCount(setterSpy)
        func()
        expect(setterSpy).toHaveBeenCalledWith(9)
    })
})

describe('PusherClientHandler decrementCount tests', () => {
    let client: PusherClientHandler;
    let setterSpy: jest.Mock
    beforeEach(()=>{
        setterSpy = jest.fn()
    })

    test('the existing count is 1, so 0 is passed to the setter',()=>{
        client = new PusherClientHandler('stub_id', 1)
        const func = client.decrementCount(setterSpy)
        func()
        expect(setterSpy).toHaveBeenCalledWith(0)
    })

    test('the existing count is 0, dont call the setter',()=>{
        client = new PusherClientHandler('stub_id', 0)
        const func = client.decrementCount(setterSpy)
        func()
        expect(setterSpy).not.toHaveBeenCalled()
    })

    test('the existing count is 8, so 7 is passed to the setter',()=>{
        client = new PusherClientHandler('stub_id', 8)
        const func = client.decrementCount(setterSpy)
        func()
        expect(setterSpy).toHaveBeenCalledWith(7)
    })
})

describe('PusherClientHandler return tests', () => {
    let requestsUnbindSpy: jest.SpyInstance;
    let bindSpy: jest.SpyInstance;
    let subscribeSpy: jest.SpyInstance;
    let client: PusherClientHandler;
    let unsubscribeSpy: jest.SpyInstance;

    beforeEach(()=>{
        jest.resetAllMocks();
        bindSpy = jest.fn();
        requestsUnbindSpy = jest.fn();
        unsubscribeSpy = jest.fn();
        subscribeSpy = jest.fn(()=>{return {bind: bindSpy, unbind: requestsUnbindSpy}});
        (getPusherClient as jest.Mock).mockReturnValue({subscribe: subscribeSpy, unsubscribe: unsubscribeSpy});
        client = new PusherClientHandler('stub_id', 0)
    })

    test('Given that the return is a function: When that function is called, then the new_friend event is unbound with the decrementCount callback',()=>{
        function expected(){}
        jest.spyOn(client, 'decrementCount').mockReturnValue(expected)
        const func = client.subscribeToPusher(jest.fn())
        func()
        expect(requestsUnbindSpy).toHaveBeenCalledWith('new_friend', expected)
    })

    test('Given that the return is a function: When that function is called, then the deny_friend event is unbound with the decrementCount callback',()=>{
        function expected(){}
        jest.spyOn(client, 'decrementCount').mockReturnValue(expected)
        const func = client.subscribeToPusher(jest.fn())
        func()
        expect(requestsUnbindSpy).toHaveBeenCalledWith('deny_friend', expected)
    })

    test('Given return is a function: when that function is called, then the incoming_friend_requests listener is unbound with the incrementCount callback',()=>{
        function expected(){}
        jest.spyOn(client, 'incrementCount').mockReturnValue(expected)
        const func = client.subscribeToPusher(jest.fn())
        func()
        expect(requestsUnbindSpy).toHaveBeenCalledWith('incoming_friend_requests', expected)
    })

    test('Given that return is a function: When that function is called, then the channel "user__54321__incoming_friend_requests" is unsubscribed',()=>{
        const client = new PusherClientHandler('54321', 0)
        const func = client.subscribeToPusher(jest.fn())
        func()
        expect(unsubscribeSpy).toHaveBeenCalledWith('user__54321__incoming_friend_requests');
    })

    test('Given that return is a function: When that function is called, then the channel "user__12345__incoming_friend_requests" is unsubscribed',()=>{
        const client = new PusherClientHandler('12345', 0)
        const func = client.subscribeToPusher(jest.fn())
        func()
        expect(unsubscribeSpy).toHaveBeenCalledWith('user__12345__incoming_friend_requests');
    })

    test('Given that return is a function: When it is called, then the channel "user__54321__friends" is unsubscribed',()=>{
        const client = new PusherClientHandler('54321', 0)
        const func = client.subscribeToPusher(jest.fn())
        func()
        expect(unsubscribeSpy).toHaveBeenCalledWith('user__54321__friends');
    })
})
