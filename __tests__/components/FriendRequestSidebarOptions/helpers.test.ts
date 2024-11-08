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
        client = new PusherClientHandler('stub', 0)
    })

    test('calling function should call PusherClient.subscribe', ()=>{
        client.subscribeToPusher()
        expect(subscribeSpy).toHaveBeenCalled();
    })

    test('if the sessionID is 12345, then subscribe is called with user:12345:incoming_friend_requests',()=>{
        client = new PusherClientHandler('12345', 0)
        client.subscribeToPusher()
        expect(subscribeSpy).toHaveBeenCalledWith('user__12345__incoming_friend_requests');
    })

    test('if the sessionID is 54321, then subscribe is called with user:12345:incoming_friend_requests',()=>{
        const client = new PusherClientHandler('54321', 0)
        client.subscribeToPusher()
        expect(subscribeSpy).toHaveBeenCalledWith('user__54321__incoming_friend_requests');
    })
})

describe('PusherClientHandler bind tests', () => {
    let subscribeSpy: jest.SpyInstance;
    let bindSpy: jest.SpyInstance;
    let client: PusherClientHandler;

    beforeEach(()=>{
        jest.resetAllMocks();
        bindSpy = jest.fn();
        subscribeSpy = jest.fn(()=>{return {bind: bindSpy}});
        (getPusherClient as jest.Mock).mockReturnValue({subscribe: subscribeSpy});
        client = new PusherClientHandler('stub', 0)
    })

    test('calling function should call channel.bind', ()=>{
        client.subscribeToPusher()
        expect(bindSpy).toHaveBeenCalled();
    })

    test('first argument to channel.bind should be "incoming_friend_requests"', ()=>{
        client.subscribeToPusher()
        expect(bindSpy).toHaveBeenCalledWith("incoming_friend_requests", expect.anything());
    })

    test('second argument to channel.bind should be the the output of  method handleRequest', ()=>{
        function expected(){}
        jest.spyOn(client, 'handleRequest').mockReturnValue(expected)
        client.subscribeToPusher()
        expect(bindSpy).toHaveBeenCalledWith(expect.anything(), expected);
    })

    test('argument from subscribeToPusher should be the same passed to handleSpy', ()=>{
        function expected(){}
        const handleSpy = jest.spyOn(client, 'handleRequest')
        client.subscribeToPusher(expected)
        expect(handleSpy).toHaveBeenCalledWith(expected);
    })
})

describe('PusherClientHandler handleRequest tests', () => {
    let client: PusherClientHandler;
    let setterSpy: jest.Mock
    beforeEach(()=>{
        setterSpy = jest.fn()
    })
    test('the existing count is 1, so 2 is passed to the setter',()=>{
        client = new PusherClientHandler('stub', 1)
        const func = client.handleRequest(setterSpy)
        func()
        expect(setterSpy).toHaveBeenCalledWith(2)
    })
    test('the existing count is 8, so 9 is passed to the setter',()=>{
        client = new PusherClientHandler('stub', 8)
        const func = client.handleRequest(setterSpy)
        func()
        expect(setterSpy).toHaveBeenCalledWith(9)
    })
})
