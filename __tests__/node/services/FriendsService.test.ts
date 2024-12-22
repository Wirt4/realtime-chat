
import {
    FriendsAbstractInterface,
    FriendsAddInterface,
    FriendsDenyInterface, FriendsRemoveInterface,
    RequestInterface
} from "@/repositories/friends/interfaces";
import {FriendsService} from "@/services/friends/service";
import {PusherDenyFriendInterface, ServiceInterfacePusherFriendsAccept} from "@/services/pusher/interface";
jest.mock("@/lib/myGetServerSession",()=> jest.fn());

describe('getIdToAdd tests',()=>{
    it('should return the id from the repo', async ()=>{
        const service = new FriendsService();
        const mockRepository: FriendsAbstractInterface = {
            getUserId: jest.fn().mockResolvedValue('id'),
            areFriends: jest.fn(),
            hasExistingFriendRequest: jest.fn(),
            userExists: jest.fn()
        }
        expect(await service.getIdToAdd('email@test.com', mockRepository)).toBe('id')
    })
})

describe('handleFriendRequest tests',()=>{
    let service: FriendsService;
    let mockRepository: FriendsAddInterface;
    let mockPusher: ServiceInterfacePusherFriendsAccept;
    const ids: Ids = {sessionId: 'idToAdd', requestId: 'userId'}
    beforeEach(()=>{
        jest.resetAllMocks()
        service = new FriendsService();
        mockRepository = {
            areFriends: jest.fn().mockResolvedValue(false),
            hasExistingFriendRequest: jest.fn().mockResolvedValue(true),
            addToFriends: jest.fn(),
            getUser: jest.fn(),
            removeFriendRequest: jest.fn(),
            getUserId: jest.fn(),
            userExists: jest.fn(),
            addToFriendRequests: jest.fn()
        }
        mockPusher = {
            addFriend: jest.fn()
        }
    })
    it('the ids are already friends, throw an error',  () => {
        mockRepository.areFriends = jest.fn().mockResolvedValue(true)
        expect(service.handleFriendRequest(ids, mockRepository, mockPusher)).rejects.toEqual('Already Friends');
    });
    it('if there is no existing Friend Request, then throw an error',async ()=>{
        mockRepository.hasExistingFriendRequest = jest.fn().mockResolvedValue(false)
        expect(service.handleFriendRequest(ids, mockRepository, mockPusher)).rejects.toEqual('No Existing Friend Request');
    })
    it('if no errors, repository.addToFriends, should be called for each participant',async ()=>{
        await service.handleFriendRequest(ids, mockRepository, mockPusher)
        expect(mockRepository.addToFriends).toHaveBeenCalledWith(ids.sessionId, ids.requestId)
        expect(mockRepository.addToFriends).toHaveBeenCalledWith(ids.requestId, ids.sessionId)
    })
    it('if no errors, should trigger the messenger service for live updates',async()=>{
        mockRepository.getUser = jest.fn().mockImplementation(async(id)=>{
            if(id === ids.sessionId) return {name: 'user'}
            return {name: 'toAdd'}
        })
        await service.handleFriendRequest(ids, mockRepository, mockPusher)
        expect(mockPusher.addFriend).toHaveBeenCalledWith(ids.requestId, {name: 'user'})
        expect(mockPusher.addFriend).toHaveBeenCalledWith(ids.sessionId, {name: 'toAdd'})
    })
    it('should call repo.removeFriendRequest', async ()=>{
        await service.handleFriendRequest(ids, mockRepository, mockPusher)
        expect(mockRepository.removeFriendRequest).toHaveBeenCalledWith(ids.sessionId, ids.requestId)
    })
})

describe('UserExists tests',()=>{
    it('the repository confirms the user exists', async ()=>{
        const service = new FriendsService();
        const mockRepository: FriendsAbstractInterface = {
            userExists: jest.fn().mockResolvedValue(true),
            areFriends:jest.fn(),
            getUserId: jest.fn(),
            hasExistingFriendRequest: jest.fn()

        }
        expect(await service.userExists('userId@test.com', mockRepository)).toBe(true)
    })
    it('the repository confirms the user exists', async ()=>{
        const service = new FriendsService();
        const mockRepository: FriendsAbstractInterface = {
            userExists: jest.fn().mockResolvedValue(true),
            areFriends:jest.fn(),
            getUserId: jest.fn(),
            hasExistingFriendRequest: jest.fn()
        }
        await service.userExists('userId@test.com', mockRepository)
        expect(mockRepository.userExists).toHaveBeenCalledWith('userId@test.com')
    })
})

describe('deny request tests',()=>{
    let service: FriendsService;
    let mockRepository: FriendsDenyInterface;
    let mockPusher: PusherDenyFriendInterface
    const ids: Ids = {sessionId:'foo', requestId:'bar'}
    beforeEach(()=>{
        jest.resetAllMocks()
        service = new FriendsService();
        mockRepository = {
            removeEntry: jest.fn()
        }
        mockPusher = {
            denyFriendRequest: jest.fn()
        }
    })
    it('should call the repository deny method', async ()=>{
        await service.removeEntry(ids,mockRepository, mockPusher)
        expect(mockRepository.removeEntry).toHaveBeenCalledWith(ids)
    })
    it('should throw if the repository throws', async () => {
        mockRepository.removeEntry = jest.fn().mockRejectedValue('error')
        try{
            await service.removeEntry(ids,mockRepository, mockPusher)
        }catch(error){
            expect(error).toEqual('Redis Error')
        }
    })
    it('should throw if the repository throws', async () => {
        mockPusher.denyFriendRequest = jest.fn().mockRejectedValue('error')
        try{
            await service.removeEntry(ids, mockRepository, mockPusher)
            expect(true).toEqual(false)
        }catch(error){
            expect(error).toEqual('Pusher Error')
        }
    })
})

describe('removeFriends tests',()=>{
    let service: FriendsService;
    let mockRepository: FriendsRemoveInterface;
    let ids: Ids
    beforeEach(()=>{
        jest.resetAllMocks()
        mockRepository = {
            removeFriend: jest.fn()
        }
        ids = {sessionId: 'foo', requestId: 'bar'}
        service = new FriendsService()
    })
    it('should make two calls to the repo removeFriend method', async ()=>{
        await service.removeFriends(ids, mockRepository)
        expect(mockRepository.removeFriend).toHaveBeenCalledTimes(2)
    })
    it('should call repo.remove friend with the sessionid and requestd, both forward and backware', async () => {
        await service.removeFriends(ids, mockRepository)
        expect(mockRepository.removeFriend).toHaveBeenCalledWith(ids.sessionId, ids.requestId)
        expect(mockRepository.removeFriend).toHaveBeenCalledWith(ids.requestId, ids.sessionId)
    });
})
