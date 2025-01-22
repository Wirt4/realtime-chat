import { aUserRepository } from "@/repositories/user/abstract";
import { FriendsService } from "@/services/friends/service";
import { ServiceInterfacePusherFriendsAccept } from "@/services/pusher/interfaces";
import { aFriendsRepository } from "@/repositories/friends/abstract";
import { PusherDenyFriendInterface } from "@/services/pusher/interfaces";
import { PusherAddFriendInterface } from "@/services/pusher/interfaces";

describe('getIdToAdd tests', () => {
    it('should return the id from the repo', async () => {
        const mockUserRepository: aUserRepository = {
            getUser: jest.fn().mockResolvedValue({ id: 'id' }),
            exists: jest.fn().mockResolvedValue(true),
            getId: jest.fn().mockResolvedValue('id')
        }
        const mockFriendsRepository = {} as aFriendsRepository;
        const mockFriendRequestsRepository = {} as aFriendsRepository;
        const mockPusher = {} as ServiceInterfacePusherFriendsAccept;
        const mockDenyPusher = {} as PusherDenyFriendInterface;
        const mockAddPusher = {} as PusherAddFriendInterface;
        const service = new FriendsService(mockUserRepository, mockFriendsRepository, mockFriendRequestsRepository, mockPusher, mockDenyPusher, mockAddPusher);

        const actual = await service.getIdToAdd('email@test.com');

        expect(actual).toEqual('id')
        expect(mockUserRepository.getId).toHaveBeenCalledWith('email@test.com');
    })
})

describe('handleFriendRequest tests', () => {
    let service: FriendsService;
    let mockUserRepository: aUserRepository;
    let mockFriendsRepository: aFriendsRepository;
    let mockPusher: ServiceInterfacePusherFriendsAccept;
    let mockDenyPusher: PusherDenyFriendInterface;
    let mockFriendRequestsRepository: aFriendsRepository;
    const ids: Ids = { sessionId: 'idToAdd', requestId: 'userId' }
    const mockAddPusher = {} as PusherAddFriendInterface;

    beforeEach(() => {
        jest.resetAllMocks()
        mockUserRepository = {
            getUser: jest.fn().mockResolvedValue({ id: 'id' }),
            exists: jest.fn().mockResolvedValue(true),
            getId: jest.fn().mockResolvedValue('id')
        }
        mockFriendsRepository = {
            exists: jest.fn().mockResolvedValue(false),
            add: jest.fn(),
            get: jest.fn(),
            remove: jest.fn()

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
        mockDenyPusher = {
            denyFriendRequest: jest.fn()
        }
    })

    it('the ids are already friends, throw an error', () => {
        mockFriendsRepository.exists = jest.fn().mockResolvedValue(true)
        service = new FriendsService(mockUserRepository, mockFriendsRepository, mockFriendRequestsRepository, mockPusher, mockDenyPusher, mockAddPusher);
        expect(service.handleFriendRequest(ids)).rejects.toEqual('Already Friends');
    });

    it('if there is no existing Friend Request, then throw an error', async () => {
        mockFriendRequestsRepository.exists = jest.fn().mockResolvedValue(false)
        service = new FriendsService(mockUserRepository, mockFriendsRepository, mockFriendRequestsRepository, mockPusher, mockDenyPusher, mockAddPusher);
        expect(service.handleFriendRequest(ids)).rejects.toEqual('No Existing Friend Request');
    });

    it('if no errors, friendsRespository.add, should be called for each participant', async () => {
        mockFriendsRepository.exists = jest.fn().mockResolvedValue(false);
        mockFriendRequestsRepository.exists = jest.fn().mockResolvedValue(true);
        service = new FriendsService(mockUserRepository, mockFriendsRepository, mockFriendRequestsRepository, mockPusher, mockDenyPusher, mockAddPusher);

        await service.handleFriendRequest(ids);

        expect(mockFriendsRepository.add).toHaveBeenCalledWith(ids.sessionId, ids.requestId);
        expect(mockFriendsRepository.add).toHaveBeenCalledWith(ids.requestId, ids.sessionId);
    });

    it('if no errors, should trigger the messenger service for live updates', async () => {
        mockUserRepository.getUser = jest.fn().mockImplementation(async (id) => {
            if (id === ids.sessionId) return { name: 'user' }
            return { name: 'toAdd' }
        })
        service = new FriendsService(mockUserRepository, mockFriendsRepository, mockFriendRequestsRepository, mockPusher, mockDenyPusher, mockAddPusher);

        await service.handleFriendRequest(ids);
        expect(mockPusher.addFriend).toHaveBeenCalledWith(ids.requestId, { name: 'user' })
        expect(mockPusher.addFriend).toHaveBeenCalledWith(ids.sessionId, { name: 'toAdd' })
    });

    it('should call friendReqeustRepo.remove', async () => {
        service = new FriendsService(mockUserRepository, mockFriendsRepository, mockFriendRequestsRepository, mockPusher, mockDenyPusher, mockAddPusher);
        await service.handleFriendRequest(ids)
        expect(mockFriendRequestsRepository.remove).toHaveBeenCalledWith(ids.sessionId, ids.requestId)
    })

});

describe('UserExists tests', () => {
    let service: FriendsService;
    let mockUserRepository: aUserRepository;
    let mockFriendsRepository: aFriendsRepository;
    let mockPusher: ServiceInterfacePusherFriendsAccept;
    let mockFriendRequestsRepository: aFriendsRepository;
    let mockDenyPusher: PusherDenyFriendInterface;
    const ids: Ids = { sessionId: 'idToAdd', requestId: 'userId' }
    const mockAddPusher = {} as PusherAddFriendInterface;

    beforeEach(() => {
        jest.resetAllMocks()
        mockUserRepository = {
            getUser: jest.fn().mockResolvedValue({ id: 'id' }),
            exists: jest.fn().mockResolvedValue(true),
            getId: jest.fn().mockResolvedValue('id')
        }
        mockFriendsRepository = {
            exists: jest.fn().mockResolvedValue(false),
            add: jest.fn(),
            get: jest.fn(),
            remove: jest.fn()

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

        mockDenyPusher = { denyFriendRequest: jest.fn() }
    })
    it('the userResposixotry confirms the user exists', async () => {
        mockUserRepository.exists = jest.fn().mockResolvedValue(true);
        service = new FriendsService(mockUserRepository, mockFriendsRepository, mockFriendRequestsRepository, mockPusher, mockDenyPusher, mockAddPusher);
        expect(await service.userExists('userId@test.com')).toBe(true);
        expect(mockUserRepository.exists).toHaveBeenCalledWith('userId@test.com');
    });
});

describe('deny request tests', () => {
    let service: FriendsService;
    let mockUserRepository: aUserRepository;
    let mockFriendsRepository: aFriendsRepository;
    let mockAcceptPusher: ServiceInterfacePusherFriendsAccept;
    let mockFriendRequestsRepository: aFriendsRepository;
    let mockDenyPusher: PusherDenyFriendInterface;
    const ids: Ids = { sessionId: 'idToAdd', requestId: 'userId' }
    const mockAddPusher = {} as PusherAddFriendInterface;

    beforeEach(() => {
        jest.resetAllMocks()
        mockUserRepository = {
            getUser: jest.fn().mockResolvedValue({ id: 'id' }),
            exists: jest.fn().mockResolvedValue(true),
            getId: jest.fn().mockResolvedValue('id')
        }
        mockFriendsRepository = {
            exists: jest.fn().mockResolvedValue(false),
            add: jest.fn(),
            get: jest.fn(),
            remove: jest.fn()

        }
        mockFriendRequestsRepository = {
            add: jest.fn(),
            remove: jest.fn(),
            exists: jest.fn().mockResolvedValue(true),
            get: jest.fn()
        }

        mockAcceptPusher = {
            addFriend: jest.fn()
        }

        mockDenyPusher = {
            denyFriendRequest: jest.fn()
        }
        service = new FriendsService(mockUserRepository, mockFriendsRepository, mockFriendRequestsRepository, mockAcceptPusher, mockDenyPusher, mockAddPusher);
    })
    it('should call the repository deny method', async () => {
        await service.removeEntry(ids)
        expect(mockFriendRequestsRepository.remove).toHaveBeenCalledWith(ids.requestId, ids.sessionId)
    });

    it('should throw if the repository throws', async () => {
        mockFriendRequestsRepository.remove = jest.fn().mockRejectedValue('error');
        service = new FriendsService(mockUserRepository, mockFriendsRepository, mockFriendRequestsRepository, mockAcceptPusher, mockDenyPusher, mockAddPusher);
        try {
            await service.removeEntry(ids)
        } catch (error) {
            expect(error).toEqual('Redis Error')
        }
    });

    it('should throw if the pusherService throws', async () => {
        mockDenyPusher.denyFriendRequest = jest.fn().mockRejectedValue('error')
        service = new FriendsService(mockUserRepository, mockFriendsRepository, mockFriendRequestsRepository, mockAcceptPusher, mockDenyPusher, mockAddPusher);
        try {
            await service.removeEntry(ids);
            expect(true).toEqual(false)
        } catch (error) {
            expect(error).toEqual('Pusher Error')
        }
    });

})

describe('removeFriends tests', () => {
    let service: FriendsService;
    let mockUserRepository: aUserRepository;
    let mockFriendsRepository: aFriendsRepository;
    let mockAcceptPusher: ServiceInterfacePusherFriendsAccept;
    let mockFriendRequestsRepository: aFriendsRepository;
    let mockDenyPusher: PusherDenyFriendInterface;
    const ids: Ids = { sessionId: 'idToAdd', requestId: 'userId' }
    const mockAddPusher = {} as PusherAddFriendInterface;

    beforeEach(() => {
        jest.resetAllMocks()
        mockUserRepository = {
            getUser: jest.fn().mockResolvedValue({ id: 'id' }),
            exists: jest.fn().mockResolvedValue(true),
            getId: jest.fn().mockResolvedValue('id')
        }
        mockFriendsRepository = {
            exists: jest.fn().mockResolvedValue(false),
            add: jest.fn(),
            get: jest.fn(),
            remove: jest.fn()
        }
        mockFriendRequestsRepository = {
            add: jest.fn(),
            remove: jest.fn(),
            exists: jest.fn().mockResolvedValue(true),
            get: jest.fn()
        }

        mockAcceptPusher = {
            addFriend: jest.fn()
        }

        mockDenyPusher = {
            denyFriendRequest: jest.fn()
        }
        service = new FriendsService(mockUserRepository, mockFriendsRepository, mockFriendRequestsRepository, mockAcceptPusher, mockDenyPusher, mockAddPusher);
    })
    it('should make two calls to the repo removeFriend method', async () => {
        await service.removeFriends(ids)
        expect(mockFriendsRepository.remove).toHaveBeenCalledTimes(2)
    })
    it('should call repo.remove friend with the sessionid and requestd, both forward and backware', async () => {
        await service.removeFriends(ids,)
        expect(mockFriendsRepository.remove).toHaveBeenCalledWith(ids.sessionId, ids.requestId)
        expect(mockFriendsRepository.remove).toHaveBeenCalledWith(ids.requestId, ids.sessionId)
    });

})

