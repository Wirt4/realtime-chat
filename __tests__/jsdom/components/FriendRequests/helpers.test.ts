import {getPusherClient} from "@/lib/pusher";
import PusherClientHandler from "@/components/FriendRequests/helpers";
import {Channel} from "pusher-js";

jest.mock("@/lib/pusher",()=>({
    getPusherClient: jest.fn()
}));

describe('subscribeToPusherClient tests, subscribe tests', ()=>{
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

    test('if the sessionID is 12345, then subscribe is called with user:12345:incoming_friend_requests',()=>{
        const client = new PusherClientHandler('12345', [])
        client.subscribeToPusherClient(jest.fn())
        expect(subscribeSpy).toHaveBeenCalledWith('user__12345__incoming_friend_requests');
    })

    test('if the sessionID is 54321 , then subscribe is called with user:54321:incoming_friend_requests',()=>{
        const client = new PusherClientHandler('54321', [])
        client.subscribeToPusherClient(jest.fn())
        expect(subscribeSpy).toHaveBeenCalledWith('user__54321__incoming_friend_requests');
    })

})

describe('subscribeToPusher tests, bind tests', ()=>{
    let subscribeSpy: jest.SpyInstance;
    let bindSpy: jest.SpyInstance;

    beforeEach(()=>{
        jest.resetAllMocks();
        bindSpy = jest.fn();
        subscribeSpy = jest.fn(()=> {return { bind: bindSpy}});
        (getPusherClient as jest.Mock).mockReturnValue({subscribe: subscribeSpy});
    })

    test('calling function should call PusherClient.bind', ()=>{
        const client = new PusherClientHandler('stub', [])
        client.subscribeToPusherClient(jest.fn)
        expect(bindSpy).toHaveBeenCalled();
    })

    test('first argument to  PusherClient.bind should be "incoming_friend_requests"', ()=>{
        const client = new PusherClientHandler('stub', [])
        client.subscribeToPusherClient(jest.fn)
        expect(bindSpy).toHaveBeenCalledWith("incoming_friend_requests", expect.anything());
    })
})

describe('subscribeToPusher tests, return value tests', ()=>{
    let subscribeSpy: jest.SpyInstance;
    let bindSpy: jest.SpyInstance;

    beforeEach(()=>{
        jest.resetAllMocks();
        bindSpy = jest.fn();
        subscribeSpy = jest.fn(()=> {return { bind: bindSpy}});
        (getPusherClient as jest.Mock).mockReturnValue({subscribe: subscribeSpy});
    })
    test('the function returns the output of teardown metho. That return valueis a callable hook', ()=>{
        const client = new PusherClientHandler('stub', [])
        function expected(){}
        jest.spyOn(client, 'tearDown').mockReturnValue(expected)
        const actual = client.subscribeToPusherClient(jest.fn)
        expect(actual).toBe(expected)
    })
})

describe('tearDown tests, unsubscribe and unbind', ()=>{
    let unSubscribeSpy: jest.SpyInstance;
    let unBindSpy: jest.SpyInstance;

    beforeEach(()=>{
        jest.resetAllMocks();
        unBindSpy = jest.fn();
        unSubscribeSpy = jest.fn(()=> {return { unbind: unBindSpy}});
        (getPusherClient as jest.Mock).mockReturnValue({unsubscribe: unSubscribeSpy});
    })

    test('if the sessionID is 12345, then subscribe is called with user:12345:incoming_friend_requests',()=>{
        const client = new PusherClientHandler('12345', [])
        const func =  client.tearDown({unbind: unBindSpy} as unknown as Channel)
        func()
        expect(unSubscribeSpy).toHaveBeenCalledWith('user__12345__incoming_friend_requests');
    })

    test('if the sessionID is 54321, then subscribe is called with user:12345:incoming_friend_requests',()=>{
        const client = new PusherClientHandler('54321',  [])
        const func =  client.tearDown({unbind: unBindSpy} as unknown as Channel)
        func()
        expect(unSubscribeSpy).toHaveBeenCalledWith('user__54321__incoming_friend_requests');
    })
    test('if the sessionID is 54321, then subscribe is called with user:12345:incoming_friend_requests',()=>{
        const client = new PusherClientHandler('54321',  [])
        const func =  client.tearDown({unbind: unBindSpy} as unknown as Channel)
        func()
        expect(unBindSpy).toHaveBeenCalledWith('incoming_friend_requests');
    })
})

describe('friendRequestHandler tests', ()=>{
    test('the setter should be called with concatenation of the existing state and the new values', ()=>{
        const setterSpy = jest.fn()
        const client = new PusherClientHandler('stub', []);
        const fn = client.friendRequestHandler(setterSpy)
        fn({senderId:'foo', senderEmail:'bar'})
        expect(setterSpy).toHaveBeenCalledWith([{senderId:'foo', senderEmail:'bar'}]);
    })

    test('the setter should be called with concatenation of the existing state and the new values, different data', ()=>{
        const setterSpy = jest.fn()
        const client = new PusherClientHandler('stub', []);
        const fn = client.friendRequestHandler(setterSpy)
        fn({senderId:'frasier', senderEmail:'imlistening@kacl.com'})
        expect(setterSpy).toHaveBeenCalledWith([{senderId:'frasier', senderEmail:'imlistening@kacl.com'}]);
    })

    test('the setter should be called with concatenation of the existing state and the new values', ()=>{
        const setterSpy = jest.fn()
        const prev = [{senderId:'foo', senderEmail:'bar'}];
        const client = new PusherClientHandler('stub', prev);
        const fn = client.friendRequestHandler(setterSpy)
        fn({senderId:'frasier', senderEmail:'imlistening@kacl.com'})
        expect(setterSpy).toHaveBeenCalledWith([{senderId:'foo', senderEmail:'bar'},
            {senderId:'frasier', senderEmail:'imlistening@kacl.com'}]);
    })
})
