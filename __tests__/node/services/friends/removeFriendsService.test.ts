import { aFriendsRepository } from '@/repositories/friends/abstract';
import { aRemoveFriendsService } from '@/services/friends/remove/abstact';
import { RemoveFriendsService } from '@/services/friends/remove/implementation';
import { idToRemoveSchema } from '@/schemas/idToRemoveSchema';
import { aUserRepository } from '@/repositories/user/abstract';
import { aMessageRepository } from '@/repositories/message/removeAll/abstract';
jest.mock('@/schemas/idToRemoveSchema');

describe('removeFriendsService', () => {
    let mockFriendsRepo: aFriendsRepository;
    let mockUsersRepo: aUserRepository;
    let mockMessageRepo: aMessageRepository;
    let service: aRemoveFriendsService;
    let requestId: string;
    let sessionId: string;

    beforeEach(() => {
        jest.resetAllMocks();
        mockFriendsRepo = {
            remove: jest.fn(),
            exists: jest.fn(),
            add: jest.fn(),
            get: jest.fn(),
        }
        mockUsersRepo = {
            getUserChats: jest.fn().mockResolvedValue([]),
            exists: jest.fn(),
            getId: jest.fn(),
            getUser: jest.fn(),
        }
        mockMessageRepo = {
            removeAllMessages: jest.fn(),
        }
        requestId = 'foo';
        sessionId = 'bar';
    })
    it('calling remove should call remove on the friends repository', async () => {
        mockFriendsRepo.exists = jest.fn().mockResolvedValue(true);
        service = new RemoveFriendsService(mockFriendsRepo, mockUsersRepo, mockMessageRepo);

        await service.removeFriends({ requestId, sessionId });

        expect(mockFriendsRepo.remove).toHaveBeenCalledTimes(2);
        expect(mockFriendsRepo.remove).toHaveBeenCalledWith(requestId, sessionId);
        expect(mockFriendsRepo.remove).toHaveBeenCalledWith(sessionId, requestId);
    });
    it('calling remove should only call remove if the friend association exists', async () => {
        mockFriendsRepo.exists = jest.fn().mockResolvedValue(false);
        service = new RemoveFriendsService(mockFriendsRepo, mockUsersRepo, mockMessageRepo);

        await service.removeFriends({ requestId, sessionId });

        expect(mockFriendsRepo.remove).not.toHaveBeenCalled();
    })

    it('calling getIdToRemove throw if parser throws', () => {
        const expectedError = new Error('bar');
        const spy = jest.spyOn(idToRemoveSchema, 'parse').mockImplementation(() => {
            throw expectedError;
        });
        const body = { idToRemove: 'foo' };
        service = new RemoveFriendsService(mockFriendsRepo, mockUsersRepo, mockMessageRepo);

        try {
            service.getIdToRemove(body);
            fail('should have thrown');
        } catch (e) {
            expect(e).toEqual(expectedError);
        } finally {
            expect(spy).toHaveBeenCalledWith(body);
        }
    });

    it('calling getIdToRemove should return the idToRemove', () => {
        const idToRemove = 'foo';
        const body = { idToRemove };
        jest.spyOn(idToRemoveSchema, 'parse').mockReturnValue(body);
        service = new RemoveFriendsService(mockFriendsRepo, mockUsersRepo, mockMessageRepo);
        expect(service.getIdToRemove(body)).toEqual(idToRemove);
    });
})
