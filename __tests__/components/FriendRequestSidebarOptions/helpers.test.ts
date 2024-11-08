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
})
