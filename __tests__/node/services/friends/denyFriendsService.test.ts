import { friendSchema } from "@/schemas/friendSchema"
import { DenyFriendsService } from "@/services/friends/deny/implementation"
import { aFriendsRepository } from "@/repositories/friends/abstract"
import { PusherDenyFriendInterface } from "@/services/pusher/interfaces";

jest.mock('@/schemas/friendSchema');

describe('denyFriendsService', () => {
    let service: DenyFriendsService;
    let requestsRepository: aFriendsRepository;
    let ids: Ids;
    let pusher: PusherDenyFriendInterface;

    beforeEach(() => {
        ids = { sessionId: '123', requestId: '456' };
        requestsRepository = {
            remove: jest.fn(),
            add: jest.fn(),
            exists: jest.fn(),
            get: jest.fn(),
        };
        pusher = {
            denyFriendRequest: jest.fn()
        };
        service = new DenyFriendsService(requestsRepository, pusher);
    });

    it('getIdToDeny test: error case', async () => {
        const expectedError = new Error('Invalid Request Payload');
        jest.spyOn(friendSchema, 'parse').mockImplementation(() => {
            throw expectedError;
        });
        try {
            service.getIdToDeny({ id: '123' });
            fail('should throw error')
        } catch (e) {
            expect(e).toEqual(expectedError);
        }
    });

    it('getIdToDeny test: happy path', async () => {
        const spy = jest.spyOn(friendSchema, 'parse').mockReturnValue({ id: '123' });
        const result = service.getIdToDeny({ id: '123' });
        expect(result).toEqual('123');
        expect(spy).toHaveBeenCalledWith({ id: '123' });
    });

    it('removeEntry should call friendRequestsRepository.remove', async () => {
        await service.removeEntry(ids);
        expect(requestsRepository.remove).toHaveBeenCalledWith(ids.sessionId, ids.requestId);
    });

    it('triggerEvent should  call the pusher with the request id and the session id', async () => {
        await service.triggerEvent(ids);
        expect(pusher.denyFriendRequest).toHaveBeenCalledWith(ids.sessionId, ids.requestId);
    });
});
