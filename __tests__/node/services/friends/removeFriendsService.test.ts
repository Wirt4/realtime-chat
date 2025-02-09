import { aFriendsRepository } from '@/repositories/friends/abstract';
import { aRemoveFriendsService } from '@/services/friends/remove/abstact';
import { RemoveFriendsService } from '@/services/friends/remove/implementation';
import { idToRemoveSchema } from '@/schemas/idToRemoveSchema';
jest.mock('@/schemas/idToRemoveSchema');

describe('removeFriendsService', () => {
    let mockRepo: aFriendsRepository;
    let service: aRemoveFriendsService;
    let requestId: string;
    let sessionId: string;

    beforeEach(() => {
        jest.resetAllMocks();
        mockRepo = {
            remove: jest.fn(),
            exists: jest.fn(),
            add: jest.fn(),
            get: jest.fn(),
        }
        requestId = 'foo';
        sessionId = 'bar';
    })
    it('calling remove should call remove on the friends repository', async () => {
        mockRepo.exists = jest.fn().mockResolvedValue(true);
        service = new RemoveFriendsService(mockRepo);

        await service.removeFriends({ requestId, sessionId });

        expect(mockRepo.remove).toHaveBeenCalledTimes(2);
        expect(mockRepo.remove).toHaveBeenCalledWith(requestId, sessionId);
        expect(mockRepo.remove).toHaveBeenCalledWith(sessionId, requestId);
    });
    it('calling remove should only call remove if the friend association exists', async () => {
        mockRepo.exists = jest.fn().mockResolvedValue(false);
        service = new RemoveFriendsService(mockRepo);

        await service.removeFriends({ requestId, sessionId });

        expect(mockRepo.remove).not.toHaveBeenCalled();
    })

    it('calling getIdToRemove throw if parser throws', () => {
        const expectedError = new Error('bar');
        const spy = jest.spyOn(idToRemoveSchema, 'parse').mockImplementation(() => {
            throw expectedError;
        });
        const body = { idToRemove: 'foo' };
        service = new RemoveFriendsService(mockRepo);

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
        service = new RemoveFriendsService(mockRepo);
        expect(service.getIdToRemove(body)).toEqual(idToRemove);
    });
})
