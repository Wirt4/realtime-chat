import PusherClientHandler from "@/components/friendRequestSidebarOptions/helpers";
import {getPusherClient} from "@/lib/pusher";

jest.mock("@/lib/pusher",()=>({
    getPusherClient: jest.fn()
}));

describe('PusherClientHandler tests', () => {
    let subscribeSpy: jest.SpyInstance;

    beforeEach(()=>{
        jest.resetAllMocks();
        subscribeSpy = jest.fn();
        (getPusherClient as jest.Mock).mockReturnValue({subscribe: subscribeSpy});
    })

    test('calling function should call PusherClient.subscribe', ()=>{
        const client = new PusherClientHandler()
        client.subscribeToPusher()
        expect(subscribeSpy).toHaveBeenCalled();
    })

    test('if the sessionID is 12345, then subscribe is called with user:12345:incoming_friend_requests',()=>{
        const client = new PusherClientHandler('12345')
        client.subscribeToPusher()
        expect(subscribeSpy).toHaveBeenCalledWith('user__12345__incoming_friend_requests');
    })
})
