import { aAcceptFriendsFacade } from '@/repositories/acceptFriendsFacade/abstract'
import { AcceptFriendsService } from '@/services/friends/accept/implementation'
import { ServiceInterfacePusherFriendsAccept } from '@/services/pusher/interfaces'

describe('acceptFriendsService', () => {
    let facade: aAcceptFriendsFacade;
    let mockPusher: ServiceInterfacePusherFriendsAccept;
    let service: AcceptFriendsService;
    beforeEach(() => {
        facade = {
            areFriends: jest.fn().mockResolvedValue(false),
            hasExistingFriendRequest: jest.fn().mockResolvedValue(true),
            getUser: jest.fn(),
            addFriend: jest.fn(),
            removeRequest: jest.fn()
        };
        mockPusher = {
            addFriend: jest.fn(),
        };
    });

    it('areFriends tests', async () => {
        const ids: Ids = { requestId: '1', sessionId: '2' };
        facade.areFriends = jest.fn().mockResolvedValue(true);

        service = new AcceptFriendsService(facade, mockPusher);
        const result = await service.areFriends(ids);

        expect(facade.areFriends).toHaveBeenCalledWith(ids);
        expect(result).toBe(true);
    });

    it('hasExistingRequest tests', async () => {
        const ids: Ids = { requestId: '1', sessionId: '2' };
        facade.hasExistingFriendRequest = jest.fn().mockResolvedValue(false);
        service = new AcceptFriendsService(facade, mockPusher);

        const result = await service.hasExistingRequest(ids);
        expect(facade.hasExistingFriendRequest).toHaveBeenCalledWith(ids);
        expect(result).toBe(false);
    });

    it('triggerEvent test', async () => {
        const ids: Ids = { requestId: '1', sessionId: '2' };
        const sessionUser: User = {
            id: ids.sessionId, email: 'stub',
            image: 'stub', name: 'stub'
        };
        const requestuser: User = {
            id: ids.requestId, email: 'stub',
            image: 'stub', name: 'stub'
        };
        facade.getUser = jest.fn(async (id: string) => {
            if (id === ids.sessionId) {
                return sessionUser
            }
            return requestuser;
        });

        service = new AcceptFriendsService(facade, mockPusher);

        await service.triggerEvent(ids);


        expect(mockPusher.addFriend).toHaveBeenCalledTimes(2);
        expect(mockPusher.addFriend).toHaveBeenCalledWith(ids.requestId, sessionUser);
        expect(mockPusher.addFriend).toHaveBeenCalledWith(ids.sessionId, requestuser);
    });

    it('store test: should take care of adding the friend and removing the request', async () => {
        const requestId = 'merry';
        const sessionId = 'pippin';
        service = new AcceptFriendsService(facade, mockPusher);

        await service.store({ requestId, sessionId });

        expect(facade.addFriend).toHaveBeenCalledTimes(2);
        expect(facade.addFriend).toHaveBeenCalledWith({ requestId, sessionId });
        expect(facade.addFriend).toHaveBeenCalledWith({ requestId: sessionId, sessionId: requestId });
        expect(facade.removeRequest).toHaveBeenCalledTimes(1);
        expect(facade.removeRequest).toHaveBeenCalledWith({ requestId, sessionId });
    });
});
