import { Redis } from '@upstash/redis';
import { AcceptFriendsFacade } from '@/repositories/acceptFriendsFacade/implementation';
import { FriendsRepository } from '@/repositories/friends/friendsImplementation';
import { FriendRequestsRepository } from '@/repositories/friends/requestsImplementation';
import { UserRepository } from '@/repositories/user/implementation';
import exp from 'constants';

jest.mock('@/repositories/friends/friendsImplementation');
jest.mock('@/repositories/friends/requestsImplementation');
jest.mock('@/repositories/user/implementation');

describe('acceptFriendsFacade', () => {
    let mockDb: Redis;
    let facade: AcceptFriendsFacade;

    beforeEach(() => {
        mockDb = { foo: 'bar' } as unknown as Redis;
    });

    it('constructor test', () => {
        facade = new AcceptFriendsFacade(mockDb);

        expect(facade).toBeTruthy();
        expect(FriendsRepository as jest.Mock).toHaveBeenCalledWith(mockDb);
        expect(FriendRequestsRepository as jest.Mock).toHaveBeenCalledWith(mockDb);
        expect(UserRepository as jest.Mock).toHaveBeenCalledWith(mockDb);
    });

    it('areFriends test', async () => {
        const sessionId = '1';
        const requestId = '2';
        const existsSpy = jest.fn().mockResolvedValue(true);
        (FriendsRepository as jest.Mock).mockImplementation(() => {
            return {
                exists: existsSpy
            }
        });
        facade = new AcceptFriendsFacade(mockDb);

        const result = await facade.areFriends({ requestId, sessionId });

        expect(result).toBe(true);
        expect(existsSpy).toHaveBeenCalledWith(sessionId, requestId);
    });

    it('hasExistingFriendRequest test', async () => {
        const existsSpy = jest.fn().mockResolvedValue(false);
        const sessionId = 'foo';
        const requestId = 'bar';
        (FriendRequestsRepository as jest.Mock).mockImplementation(() => {
            return {
                exists: existsSpy
            }
        });
        facade = new AcceptFriendsFacade(mockDb);

        const result = await facade.hasExistingFriendRequest({ requestId, sessionId });

        expect(result).toBe(false);
        expect(existsSpy).toHaveBeenCalledWith(sessionId, requestId);
    });

    it('getUser test', async () => {
        const userId = 'foo';
        const user: User = {
            id: userId,
            email: 'stub@gmail.com',
            name: 'userName',
            image: 'imagesrc',
        };
        const getUserSpy = jest.fn().mockResolvedValue(user);
        (UserRepository as jest.Mock).mockImplementation(() => {
            return {
                getUser: getUserSpy
            }
        });
        facade = new AcceptFriendsFacade(mockDb);

        const result = await facade.getUser(userId);

        expect(result).toEqual(user);
        expect(getUserSpy).toHaveBeenCalledWith(userId);
    });

    it('addFriend test', async () => {
        const sessionId = 'foo';
        const requestId = 'bar';
        const addFriendSpy = jest.fn();
        (FriendsRepository as jest.Mock).mockImplementation(() => {
            return {
                add: addFriendSpy
            }
        });
        facade = new AcceptFriendsFacade(mockDb);

        await facade.addFriend({ requestId, sessionId });

        expect(addFriendSpy).toHaveBeenCalledWith(sessionId, requestId);
    });

    it('removeRequest test', async () => {
        const sessionId = 'foo';
        const requestId = 'bar';
        const removeRequestSpy = jest.fn();
        (FriendRequestsRepository as jest.Mock).mockImplementation(() => {
            return {
                remove: removeRequestSpy
            }
        });
        facade = new AcceptFriendsFacade(mockDb);

        await facade.removeRequest({ requestId, sessionId });

        expect(removeRequestSpy).toHaveBeenCalledWith(sessionId, requestId);
    });
});
