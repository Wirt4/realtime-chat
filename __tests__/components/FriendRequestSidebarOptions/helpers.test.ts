import PusherClientHandler from "@/components/friendRequestSidebarOptions/helpers";
import {getPusherClient} from "@/lib/pusher";

jest.mock("@/lib/pusher",()=>({
    getPusherClient: jest.fn()
}));

describe('PusherClientHandler tests', () => {
    let subscribeSpy: jest.SpyInstance;
    let bindSpy: jest.SpyInstance;

    beforeEach(()=>{
        jest.resetAllMocks();
        bindSpy = jest.fn();
        subscribeSpy = jest.fn(()=>{return {bind: bindSpy}});
        (getPusherClient as jest.Mock).mockReturnValue({subscribe: subscribeSpy});
    })

    test('calling function should call PusherClient.subscribe', ()=>{
        const client = new PusherClientHandler('stub')
        client.subscribeToPusher()
        expect(subscribeSpy).toHaveBeenCalled();
    })

    test('if the sessionID is 12345, then subscribe is called with user:12345:incoming_friend_requests',()=>{
        const client = new PusherClientHandler('12345')
        client.subscribeToPusher()
        expect(subscribeSpy).toHaveBeenCalledWith('user__12345__incoming_friend_requests');
    })

    test('if the sessionID is 54321, then subscribe is called with user:12345:incoming_friend_requests',()=>{
        const client = new PusherClientHandler('54321')
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
        client = new PusherClientHandler('stub')
    })

    test('calling function should call channel.bind', ()=>{
        client.subscribeToPusher()
        expect(bindSpy).toHaveBeenCalled();
    })

    test('first argument to channel.bind should be "incoming_friend_requests"', ()=>{
        client.subscribeToPusher()
        expect(bindSpy).toHaveBeenCalledWith("incoming_friend_requests", expect.anything());
    })

    test('second argument to channel.bind should be the method handleRequest', ()=>{
        client.subscribeToPusher()
        expect(bindSpy).toHaveBeenCalledWith(expect.anything(), client.handleRequest);
    })
})
