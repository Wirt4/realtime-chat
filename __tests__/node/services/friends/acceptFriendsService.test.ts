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

    it('if areFriends resolves to true, then throw', async () => {
        facade.areFriends = jest.fn().mockResolvedValue(true);
        service = new AcceptFriendsService(facade, mockPusher);

        try {
            await service.handleRequest({ requestId: '1', sessionId: '2' });
            expect(true).toBe(false);
        } catch (e) {
            expect(e).toBe('Already friends');
        }
    });

    it("if areFriends resolves to false, then don't throw already friends", async () => {
        service = new AcceptFriendsService(facade, mockPusher);

        try {
            await service.handleRequest({ requestId: '1', sessionId: '2' });
        } catch (e) {
            expect(e).not.toBe('Already friends');
        }
    });

    it('if hasExistingFriendRequest resolves to false, then throw', async () => {
        facade.hasExistingFriendRequest = jest.fn().mockResolvedValue(false);
        service = new AcceptFriendsService(facade, mockPusher);

        try {
            await service.handleRequest({ requestId: '1', sessionId: '2' });
            expect(true).toBe(false);
        } catch (e) {
            expect(e).toBe('No friend request found');
        }
    });

    it('if no errors, get the users from the ids', async () => {
        const sessionId = 'foo';
        const requestId = 'bar';
        const sessionUser: User = {
            id: sessionId, email: 'stub',
            image: 'stub', name: 'stub'
        };
        const requestuser: User = {
            id: requestId, email: 'stub',
            image: 'stub', name: 'stub'
        };
        facade.getUser = jest.fn(async (id: string) => {
            if (id === sessionId) {
                return sessionUser
            }
            return requestuser;

        });
        service = new AcceptFriendsService(facade, mockPusher);

        await service.handleRequest({ requestId, sessionId });

        expect(facade.getUser).toHaveBeenCalledTimes(2);
        expect(facade.getUser).toHaveBeenCalledWith(sessionId);
        expect(facade.getUser).toHaveBeenCalledWith(requestId);
    });

    it('friends should be mutually added', async () => {
        const requestId = 'merry';
        const sessionId = 'pippin';
        service = new AcceptFriendsService(facade, mockPusher);

        await service.handleRequest({ requestId, sessionId });

        expect(facade.addFriend).toHaveBeenCalledTimes(2);
        expect(facade.addFriend).toHaveBeenCalledWith({ requestId, sessionId });
        expect(facade.addFriend).toHaveBeenCalledWith({ requestId: sessionId, sessionId: requestId });
    })

    it('removeRequest should be called', async () => {
        const requestId = 'merry';
        const sessionId = 'pippin';
        service = new AcceptFriendsService(facade, mockPusher);

        await service.handleRequest({ requestId, sessionId });

        expect(facade.removeRequest).toHaveBeenCalledTimes(1);
        expect(facade.addFriend).toHaveBeenCalledWith({ requestId, sessionId });
    });

    it('pusher should be called with the correct arguments', async () => {
        const sessionId = 'foo';
        const requestId = 'bar';
        const sessionUser: User = {
            id: sessionId, email: 'stub',
            image: 'stub', name: 'stub'
        };
        const requestuser: User = {
            id: requestId, email: 'stub',
            image: 'stub', name: 'stub'
        };
        facade.getUser = jest.fn(async (id: string) => {
            if (id === sessionId) {
                return sessionUser
            }
            return requestuser;
        });
        service = new AcceptFriendsService(facade, mockPusher);

        await service.handleRequest({ requestId, sessionId });

        expect(mockPusher.addFriend).toHaveBeenCalledTimes(2);
        expect(mockPusher.addFriend).toHaveBeenCalledWith(requestId, sessionUser);
        expect(mockPusher.addFriend).toHaveBeenCalledWith(sessionId, requestuser);
    });
});
