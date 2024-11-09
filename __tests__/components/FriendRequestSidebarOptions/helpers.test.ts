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

    test('calling function should call PusherClient.subscribe', ()=>{
        client.subscribeToPusher(jest.fn())
        expect(subscribeSpy).toHaveBeenCalled();
    })

    test('if the sessionID is 12345, then subscribe is called with user__12345__friends',()=>{
        client = new PusherClientHandler('12345', 0)
        client.subscribeToPusher(jest.fn())
        expect(subscribeSpy).toHaveBeenCalledWith('user__12345__friends');
    })

    test('if the sessionID is 54321, then subscribe is called with user__54321__friends',()=>{
        client = new PusherClientHandler('54321', 0)
        client.subscribeToPusher(jest.fn())
        expect(subscribeSpy).toHaveBeenCalledWith('user__54321__friends');
    })

    test('if the sessionID is 12345, then subscribe is called with user__12345__incoming_friend_requests',()=>{
        client = new PusherClientHandler('12345', 0)
        client.subscribeToPusher(jest.fn())
        expect(subscribeSpy).toHaveBeenCalledWith('user__12345__incoming_friend_requests');
    })

    test('if the sessionID is 54321, then subscribe is called with user:12345:incoming_friend_requests',()=>{
        const client = new PusherClientHandler('54321', 0)
        client.subscribeToPusher(jest.fn())
        expect(subscribeSpy).toHaveBeenCalledWith('user__54321__incoming_friend_requests');
    })
})

describe('PusherClientHandler bind tests', () => {
    let subscribeSpy: jest.SpyInstance;
    let requestBindSpy: jest.SpyInstance;
    let friendBindSpy: jest.SpyInstance;
    let client: PusherClientHandler;

    beforeEach(()=>{
        jest.resetAllMocks();
        requestBindSpy = jest.fn();
        friendBindSpy = jest.fn();
        subscribeSpy = jest.fn((channel: string)=>{
            if (channel.endsWith('requests')){
                return {bind: requestBindSpy}
            }
            return {bind: friendBindSpy}
        });

        (getPusherClient as jest.Mock).mockImplementation(()=>{
            return {subscribe: subscribeSpy}
        });

        client = new PusherClientHandler('stub_id', 0)
    })

    test("calling function should call the request channel's bind method", ()=>{
        client.subscribeToPusher(jest.fn())
        expect(requestBindSpy).toHaveBeenCalled();
    })

    test("calling function should call the friends channel's bind method",()=>{
        client.subscribeToPusher(jest.fn())
        expect(friendBindSpy).toHaveBeenCalled();
    })

    test('first argument to requestChannel.bind should be "incoming_friend_requests"', ()=>{
        client.subscribeToPusher(jest.fn())
        expect(requestBindSpy).toHaveBeenCalledWith("incoming_friend_requests", expect.anything());
    })

    test('second argument to requestsChannel.bind should be the the output of method handleRequest', ()=>{
        function expected(){}
        jest.spyOn(client, 'handleRequest').mockReturnValue(expected)
        client.subscribeToPusher(jest.fn())
        expect(requestBindSpy).toHaveBeenCalledWith(expect.anything(), expected);
    })

    test('argument from subscribeToPusher should be the same passed to handleSpy', ()=>{
        function expected(){}
        const handleSpy = jest.spyOn(client, 'handleRequest')
        client.subscribeToPusher(expected)
        expect(handleSpy).toHaveBeenCalledWith(expected);
    })

    test('first argument passed to friendsChannel.bind should be "new_friend"',()=>{
        client.subscribeToPusher(jest.fn())
        expect(friendBindSpy).toHaveBeenCalledWith("new_friend", expect.anything());
    })
})

describe('PusherClientHandler handleRequest tests', () => {
    let client: PusherClientHandler;
    let setterSpy: jest.Mock
    beforeEach(()=>{
        setterSpy = jest.fn()
    })

    test('the existing count is 1, so 2 is passed to the setter',()=>{
        client = new PusherClientHandler('stub_id', 1)
        const func = client.handleRequest(setterSpy)
        func()
        expect(setterSpy).toHaveBeenCalledWith(2)
    })

    test('the existing count is 8, so 9 is passed to the setter',()=>{
        client = new PusherClientHandler('stub_id', 8)
        const func = client.handleRequest(setterSpy)
        func()
        expect(setterSpy).toHaveBeenCalledWith(9)
    })
})

describe('PusherClientHandler return tests', () => {
    let unBindSpy: jest.SpyInstance;
    let bindSpy: jest.SpyInstance;
    let subscribeSpy: jest.SpyInstance;
    let client: PusherClientHandler;
    let unsubscribeSpy: jest.SpyInstance;

    beforeEach(()=>{
        jest.resetAllMocks();
        bindSpy = jest.fn();
        unBindSpy = jest.fn();
        unsubscribeSpy = jest.fn();
        subscribeSpy = jest.fn(()=>{return {bind: bindSpy, unbind: unBindSpy}});
        (getPusherClient as jest.Mock).mockReturnValue({subscribe: subscribeSpy, unsubscribe: unsubscribeSpy});
        client = new PusherClientHandler('stub_id', 0)
    })

    test('return is a function, it should call unbind',()=>{
        const func = client.subscribeToPusher(jest.fn())
        func()
        expect(unBindSpy).toHaveBeenCalledWith('incoming_friend_requests', expect.anything())
    })

    test('return is a function, it should call unbind with the result of handleRequest',()=>{
        function expected(){}
        jest.spyOn(client, 'handleRequest').mockReturnValue(expected)
        const func = client.subscribeToPusher(jest.fn())
        func()
        expect(unBindSpy).toHaveBeenCalledWith(expect.anything(), expected)
    })

    test('return is a function, it should call unsubscribe on the pusher client',()=>{
        const func = client.subscribeToPusher(jest.fn())
        func()
        expect(unsubscribeSpy).toHaveBeenCalled()
    })

    test('return is a function, it should call unsubscribe on the pusher client',()=>{
        const client = new PusherClientHandler('54321', 0)
        const func = client.subscribeToPusher(jest.fn())
        func()
        expect(unsubscribeSpy).toHaveBeenCalledWith('user__54321__incoming_friend_requests');
    })

    test('return is a function, it should call unsubscribe on the pusher client',()=>{
        const client = new PusherClientHandler('12345', 0)
        const func = client.subscribeToPusher(jest.fn())
        func()
        expect(unsubscribeSpy).toHaveBeenCalledWith('user__12345__incoming_friend_requests');
    })
})
