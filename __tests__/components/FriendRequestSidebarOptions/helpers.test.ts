import PusherClientHandler from "@/components/FriendRequests/helpers";
import {getPusherClient} from "@/lib/pusher";

describe('PusherClientHandler tests', () => {
    let subscribeSpy: jest.SpyInstance;
    let bindSpy: jest.SpyInstance;

    beforeEach(()=>{
        jest.resetAllMocks();
        bindSpy = jest.fn();
        subscribeSpy = jest.fn(()=> {return { bind: bindSpy}});
        (getPusherClient as jest.Mock).mockReturnValue({subscribe: subscribeSpy});
    })
    test('calling function should call PusherClient.subscribe', ()=>{
        const client = new PusherClientHandler('stub',  [])
        client.subscribeToPusherClient(jest.fn())
        expect(subscribeSpy).toHaveBeenCalled();
    })
})
