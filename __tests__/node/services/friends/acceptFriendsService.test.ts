import { aAcceptFriendsFacade } from '@/repositories/acceptFriendsFacade/abstract'
import { AcceptFriendsService } from '@/services/friends/accept/implementation'
import { ServiceInterfacePusherFriendsAccept } from '@/services/pusher/interfaces'
import { friendSchema } from "@/schemas/friendSchema";
import { aChatProfileService } from '@/services/chatProfile/abstract';

jest.mock("@/schemas/friendSchema");

describe('acceptFriendsService', () => {
    let facade: aAcceptFriendsFacade;
    let mockPusher: ServiceInterfacePusherFriendsAccept;
    let service: AcceptFriendsService;
    let mockChatProfileService: aChatProfileService

    beforeEach(() => {
        facade = {
            areFriends: jest.fn().mockResolvedValue(false),
            hasExistingFriendRequest: jest.fn().mockResolvedValue(true),
            getUser: jest.fn(),
            addFriend: jest.fn(),
            removeRequest: jest.fn(),
            addToUserChats: jest.fn(),
        };
        mockPusher = {
            addFriend: jest.fn(),
        };
        mockChatProfileService = {
            createChat: jest.fn(),
            addUserToChat: jest.fn(),
        }
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

        service = new AcceptFriendsService(facade, mockPusher, mockChatProfileService);

        await service.triggerEvent(ids);


        expect(mockPusher.addFriend).toHaveBeenCalledTimes(2);
        expect(mockPusher.addFriend).toHaveBeenCalledWith(ids.requestId, sessionUser);
        expect(mockPusher.addFriend).toHaveBeenCalledWith(ids.sessionId, requestuser);
    });

    it('acceptFriendRequestt: should take care of adding the friend and removing the request', async () => {
        const requestId = 'merry';
        const sessionId = 'pippin';
        service = new AcceptFriendsService(facade, mockPusher, mockChatProfileService);

        await service.acceptFriendRequest({ requestId, sessionId });

        expect(facade.addFriend).toHaveBeenCalledTimes(2);
        expect(facade.addFriend).toHaveBeenCalledWith({ requestId, sessionId });
        expect(facade.addFriend).toHaveBeenCalledWith({ requestId: sessionId, sessionId: requestId });
        expect(facade.removeRequest).toHaveBeenCalledTimes(1);
        expect(facade.removeRequest).toHaveBeenCalledWith({ requestId, sessionId });
    });

    it('acceptFriendRequest throws if the ids are already friends', async () => {
        facade.areFriends = jest.fn().mockResolvedValue(true);
        service = new AcceptFriendsService(facade, mockPusher, mockChatProfileService);
        const expected = new Error("Already friends");
        const ids: Ids = { requestId: '1', sessionId: '2' };

        try {
            await service.acceptFriendRequest(ids);
            expect(true).toBe(false);
        } catch (e) {
            expect(e).toEqual(expected);
        }
    });

    it('acceptFriendRequest throws if there is no friend request', async () => {
        facade.hasExistingFriendRequest = jest.fn().mockResolvedValue(false);
        service = new AcceptFriendsService(facade, mockPusher, mockChatProfileService);
        const expected = new Error("No existing friend request");
        const ids: Ids = { requestId: '1', sessionId: '2' };

        try {
            await service.acceptFriendRequest(ids);
            expect(true).toBe(false);
        } catch (e) {
            expect(e).toEqual(expected);
        } finally {
            expect(facade.hasExistingFriendRequest).toHaveBeenCalledTimes(1);
            expect(facade.hasExistingFriendRequest).toHaveBeenCalledWith(ids);
        }
    });

    it('acceptFriendRequest throws if the friends are the same id', async () => {
        service = new AcceptFriendsService(facade, mockPusher, mockChatProfileService);
        const ids: Ids = { requestId: '1', sessionId: '1' };
        const expected = new Error("You can't be friends with yourself");

        try {
            await service.acceptFriendRequest(ids);
            expect(true).toBe(false);
        } catch (e) {
            expect(e).toEqual(expected);
        }
    });

    it('if the parser for getIdTo add throws, then getIdToAdd throws', async () => {
        service = new AcceptFriendsService(facade, mockPusher, mockChatProfileService);
        const expectedError = new Error('parse error');
        friendSchema.parse = jest.fn(() => {
            throw expectedError
        });
        const id = '1';
        try {
            service.getIdToAdd({ id });
            expect(true).toBe(false);
        } catch (e) {
            expect(e).toBe(expectedError);
        }
    });

    it('if the parser returns a clean object, then return the appropriate string', async () => {
        service = new AcceptFriendsService(facade, mockPusher, mockChatProfileService);
        const idToAdd = '1';
        friendSchema.parse = jest.fn(() => ({ id: idToAdd }));
        expect(service.getIdToAdd({ id: idToAdd })).toBe(idToAdd);
    });
});

describe('acceptFriendsService.generateNewChat', () => {
    let facade: aAcceptFriendsFacade;
    let mockPusher: ServiceInterfacePusherFriendsAccept;
    let service: AcceptFriendsService;
    let mockChatProfileService: aChatProfileService

    beforeEach(() => {
        facade = {
            areFriends: jest.fn().mockResolvedValue(false),
            hasExistingFriendRequest: jest.fn().mockResolvedValue(true),
            getUser: jest.fn(),
            addFriend: jest.fn(),
            removeRequest: jest.fn(),
            addToUserChats: jest.fn(),
        };
        mockPusher = {
            addFriend: jest.fn(),
        };
        mockChatProfileService = {
            createChat: jest.fn(),
            addUserToChat: jest.fn(),
        }
        service = new AcceptFriendsService(facade, mockPusher, mockChatProfileService);
    });

    it('generateNewChat should call add the id returned by chatProfileService to the chats entry for the sessionId', async () => {
        mockChatProfileService.createChat = jest.fn(async () => 'randomizedChatId');

        await service.generateNewChat({ requestId: 'requestUser', sessionId: 'sessionUser' });

        expect(facade.addToUserChats).toHaveBeenCalledWith('requestUser', 'randomizedChatId');
        expect(facade.addToUserChats).toHaveBeenCalledWith('sessionUser', 'randomizedChatId');
    });
    it('generateNewChat should call add the id returned by chatProfileService to the chats entry for the sessionId', async () => {
        mockChatProfileService.createChat = jest.fn(async () => 'randomizedChatId');

        await service.generateNewChat({ requestId: 'requestUser', sessionId: 'sessionUser' });

        expect(mockChatProfileService.addUserToChat).toHaveBeenCalledWith('randomizedChatId', 'requestUser');
        expect(mockChatProfileService.addUserToChat).toHaveBeenCalledWith('randomizedChatId', 'sessionUser');
    });
});
