import { Redis } from '@upstash/redis';
import { AddFriendsFacade } from '@/repositories/addFriendsFacade/implementation';
import { FriendRequestsRepository } from '@/repositories/friends/requestsImplementation';
import { FriendsRepository } from '@/repositories/friends/friendsImplementation';
import { UserRepository } from '@/repositories/user/implementation';
jest.mock('@/repositories/friends/requestsImplementation');
jest.mock('@/repositories/user/implementation');
jest.mock('@/repositories/friends/friendsImplementation');

describe('addFriendsFacade tests', () => {
    let db: Redis;
    let facade: AddFriendsFacade;
    let ids: Ids
    let requestId: string;
    let sessionId: string;
    let email: string;
    beforeEach(() => {
        db = { foo: 'bar' } as unknown as Redis;
        facade = new AddFriendsFacade(db);
        sessionId = 'foo';
        requestId = 'bar';
        ids = { sessionId, requestId };
        email = 'example@example.com'
    });

    it('store', async () => {
        const addSpy = jest.spyOn(FriendRequestsRepository.prototype, 'add');
        await facade.store(ids);
        expect(addSpy).toHaveBeenCalledWith(requestId, sessionId);
    });

    it('getUserId', async () => {
        const idSpy = jest.spyOn(UserRepository.prototype, 'getId').mockResolvedValue(sessionId);

        const result = await facade.getUserId(email);

        expect(result).toEqual(sessionId);
        expect(idSpy).toHaveBeenCalledWith(email);
    });

    it('areFriends', async () => {
        const exisitsSpy = jest.spyOn(FriendsRepository.prototype, 'exists').mockResolvedValue(true);

        const result = await facade.areFriends(ids);
        expect(result).toEqual(true);

        expect(exisitsSpy).toHaveBeenCalledWith(sessionId, requestId);
    });

    it('userExists', async () => {
        const userExistsSpy = jest.spyOn(UserRepository.prototype, 'exists').mockResolvedValue(false);

        const result = await facade.userExists(email);

        expect(result).toEqual(false);
        expect(userExistsSpy).toHaveBeenCalledWith(email);
    });

    it('hasFriendRequest', async () => {
        const existsSpy = jest.spyOn(FriendRequestsRepository.prototype, 'exists').mockResolvedValue(true);

        const result = await facade.hasFriendRequest(ids);

        expect(result).toEqual(true);
        expect(existsSpy).toHaveBeenCalledWith(sessionId, requestId);
    });
});
