
import { aUserRepository } from "@/repositories/user/abstract";
import { FriendsService } from "@/services/friends/service";
import { ServiceInterfacePusherFriendsAccept } from "@/services/pusher/interfaces";
import { aFriendsRepository } from "@/repositories/friends/abstract";
import { aFriendRequestsRepository } from "@/repositories/friendRequests/abstract";

describe('getIdToAdd tests', () => {
    it('should return the id from the repo', async () => {
        const mockUserRepository: aUserRepository = {
            get: jest.fn().mockResolvedValue({ id: 'id' }),
            exists: jest.fn().mockResolvedValue(true)
        }
        const mockFriendsRepository = {} as aFriendsRepository;
        const mockFriendRequestsRepository = {} as aFriendRequestsRepository;
        const mockPusher = {} as ServiceInterfacePusherFriendsAccept;
        const service = new FriendsService(mockUserRepository, mockFriendsRepository, mockFriendRequestsRepository, mockPusher);

        const actual = await service.getIdToAdd('email@test.com');

        expect(actual).toEqual('id')
        expect(mockUserRepository.get).toHaveBeenCalledWith('email@test.com');
    })
})

describe('handleFriendRequest tests', () => {
    let service: FriendsService;
    let mockUserRepository: aUserRepository;
    let mockFriendsRepository: aFriendsRepository;
    let mockPusher: ServiceInterfacePusherFriendsAccept;
    let mockFriendRequestsRepository: aFriendRequestsRepository;
    const ids: Ids = { sessionId: 'idToAdd', requestId: 'userId' }

    beforeEach(() => {
        jest.resetAllMocks()
        mockUserRepository = {
            get: jest.fn().mockResolvedValue({ id: 'id' }),
            exists: jest.fn().mockResolvedValue(true)
        }
        mockFriendsRepository = {
            exists: jest.fn().mockResolvedValue(false),
            add: jest.fn(),
            get: jest.fn(),

        }
        mockFriendRequestsRepository = {
            add: jest.fn(),
            remove: jest.fn(),
            exists: jest.fn().mockResolvedValue(true),
            get: jest.fn()
        }

        mockPusher = {
            addFriend: jest.fn()
        }
    })

    it('the ids are already friends, throw an error', () => {
        mockFriendsRepository.exists = jest.fn().mockResolvedValue(true)
        service = new FriendsService(mockUserRepository, mockFriendsRepository, mockFriendRequestsRepository, mockPusher);
        expect(service.handleFriendRequest(ids)).rejects.toEqual('Already Friends');
    });

    it('if there is no existing Friend Request, then throw an error', async () => {
        mockFriendRequestsRepository.exists = jest.fn().mockResolvedValue(false)
        service = new FriendsService(mockUserRepository, mockFriendsRepository, mockFriendRequestsRepository, mockPusher);
        expect(service.handleFriendRequest(ids)).rejects.toEqual('No Existing Friend Request');
    });

    it('if no errors, friendsRespository.add, should be called for each participant', async () => {
        mockFriendsRepository.exists = jest.fn().mockResolvedValue(false);
        mockFriendRequestsRepository.exists = jest.fn().mockResolvedValue(true);
        service = new FriendsService(mockUserRepository, mockFriendsRepository, mockFriendRequestsRepository, mockPusher);

        await service.handleFriendRequest(ids);

        expect(mockFriendsRepository.add).toHaveBeenCalledWith(ids.sessionId, ids.requestId);
        expect(mockFriendsRepository.add).toHaveBeenCalledWith(ids.requestId, ids.sessionId);
    });

    it('if no errors, should trigger the messenger service for live updates', async () => {
        mockUserRepository.get = jest.fn().mockImplementation(async (id) => {
            if (id === ids.sessionId) return { name: 'user' }
            return { name: 'toAdd' }
        })
        service = new FriendsService(mockUserRepository, mockFriendsRepository, mockFriendRequestsRepository, mockPusher);

        await service.handleFriendRequest(ids);
        expect(mockPusher.addFriend).toHaveBeenCalledWith(ids.requestId, { name: 'user' })
        expect(mockPusher.addFriend).toHaveBeenCalledWith(ids.sessionId, { name: 'toAdd' })
    });

    it('should call friendReqeustRepo.remove', async () => {
        service = new FriendsService(mockUserRepository, mockFriendsRepository, mockFriendRequestsRepository, mockPusher);
        await service.handleFriendRequest(ids)
        expect(mockFriendRequestsRepository.remove).toHaveBeenCalledWith(ids.sessionId, ids.requestId)
    })

});
/*
describe('UserExists tests', () => {
    it('the repository confirms the user exists', async () => {
        const service = new FriendsService();
        const mockRepository: FriendsAbstractInterface = {
            userExists: jest.fn().mockResolvedValue(true),
            areFriends: jest.fn(),
            getUserId: jest.fn(),
            hasExistingFriendRequest: jest.fn()

        }
        expect(await service.userExists('userId@test.com', mockRepository)).toBe(true)
    })
    it('the repository confirms the user exists', async () => {
        const service = new FriendsService();
        const mockRepository: FriendsAbstractInterface = {
            userExists: jest.fn().mockResolvedValue(true),
            areFriends: jest.fn(),
            getUserId: jest.fn(),
            hasExistingFriendRequest: jest.fn()
        }
        await service.userExists('userId@test.com', mockRepository)
        expect(mockRepository.userExists).toHaveBeenCalledWith('userId@test.com')
    })
})

describe('deny request tests', () => {
    let service: FriendsService;
    let mockRepository: FriendsDenyInterface;
    let mockPusher: PusherDenyFriendInterface
    const ids: Ids = { sessionId: 'foo', requestId: 'bar' }
    beforeEach(() => {
        jest.resetAllMocks()
        service = new FriendsService();
        mockRepository = {
            removeEntry: jest.fn()
        }
        mockPusher = {
            denyFriendRequest: jest.fn()
        }
    })
    it('should call the repository deny method', async () => {
        await service.removeEntry(ids, mockRepository, mockPusher)
        expect(mockRepository.removeEntry).toHaveBeenCalledWith(ids)
    })
    it('should throw if the repository throws', async () => {
        mockRepository.removeEntry = jest.fn().mockRejectedValue('error')
        try {
            await service.removeEntry(ids, mockRepository, mockPusher)
        } catch (error) {
            expect(error).toEqual('Redis Error')
        }
    })
    it('should throw if the repository throws', async () => {
        mockPusher.denyFriendRequest = jest.fn().mockRejectedValue('error')
        try {
            await service.removeEntry(ids, mockRepository, mockPusher)
            expect(true).toEqual(false)
        } catch (error) {
            expect(error).toEqual('Pusher Error')
        }
    })
})

describe('removeFriends tests', () => {
    let service: FriendsService;
    let mockRepository: FriendsRemoveInterface;
    let ids: Ids
    beforeEach(() => {
        jest.resetAllMocks()
        mockRepository = {
            removeFriend: jest.fn()
        }
        ids = { sessionId: 'foo', requestId: 'bar' }
        service = new FriendsService()
    })
    it('should make two calls to the repo removeFriend method', async () => {
        await service.removeFriends(ids, mockRepository)
        expect(mockRepository.removeFriend).toHaveBeenCalledTimes(2)
    })
    it('should call repo.remove friend with the sessionid and requestd, both forward and backware', async () => {
        await service.removeFriends(ids, mockRepository)
        expect(mockRepository.removeFriend).toHaveBeenCalledWith(ids.sessionId, ids.requestId)
        expect(mockRepository.removeFriend).toHaveBeenCalledWith(ids.requestId, ids.sessionId)
    });

})
    */
