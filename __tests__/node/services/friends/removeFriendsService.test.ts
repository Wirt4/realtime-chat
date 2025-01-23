import { aFriendsRepository } from '@/repositories/friends/abstract';
import { aRemoveFriendsService } from '@/services/friends/remove/abstact';
import { RemoveFriendsService } from '@/services/friends/remove/implementation';

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
})
