import { AddFriendService } from '@/services/friends/add/implementation';
import { aAddFriendsFacade } from '@/repositories/addFriendsFacade/abstract';
import { PusherAddFriendInterface } from '@/services/pusher/interfaces';
describe('addFriendService tests', () => {
    let ids: Ids;
    let email: string;
    let facade: aAddFriendsFacade;
    let pusher: PusherAddFriendInterface;
    let service: AddFriendService;
    beforeEach(() => {
        ids = { requestId: 'a-request-id', sessionId: 'a-session-id' };
        email = 'senderEmail@test.com';
        facade = {
            store: jest.fn(),
            getUserId: jest.fn()
        };
        pusher = {
            addFriendRequest: jest.fn()
        }
        service = new AddFriendService(facade, pusher);
    });
    it('trigger event should call the pusher', async () => {
        await service.triggerEvent(ids, email);

        expect(pusher.addFriendRequest).toHaveBeenCalledTimes(1);
        expect(pusher.addFriendRequest).toHaveBeenCalledWith(ids.sessionId, ids.requestId, email);
    });

    it('store should call the facade method store with ids', async () => {
        await service.storeFriendRequest(ids);

        expect(facade.store).toHaveBeenCalledTimes(1);
        expect(facade.store).toHaveBeenCalledWith(ids);
    });

    it('getIdFromEmail', async () => {
        const id = 'a-user-id';
        facade.getUserId = jest.fn().mockResolvedValue(id);
        service = new AddFriendService(facade, pusher);

        const result = await service.getIdFromEmail(email);

        expect(result).toBe(id);
        expect(facade.getUserId).toHaveBeenCalledTimes(1);
        expect(facade.getUserId).toHaveBeenCalledWith(email);
    })

    it('isSameUser should compare the strings', () => {
        expect(service.isSameUser({ requestId: 'ayn', sessionId: 'ayn' })).toBe(true);
        expect(service.isSameUser({ requestId: 'oil', sessionId: 'water' })).toBe(false);
    })
});
