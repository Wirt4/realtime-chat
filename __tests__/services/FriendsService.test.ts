
import {FriendsAbstractInterface, FriendsAddInterface, RequestInterface} from "@/repositories/friends/interfaces";
import {FriendsService} from "@/services/friends/service";
import {ServiceInterfacePusherFriendsAccept} from "@/services/pusher/interface";
jest.mock("@/lib/myGetServerSession",()=> jest.fn());

describe('getIdToAdd tests',()=>{
    it('should return the id from the repo', async ()=>{
        const service = new FriendsService();
        const mockRepository: FriendsAbstractInterface = {
            getUserId: jest.fn().mockResolvedValue('id'),
            areFriends: jest.fn(),
            hasExistingFriendRequest: jest.fn()
        }
        expect(await service.getIdToAdd('email@test.com', mockRepository)).toBe('id')
    })
})

describe('handleFriendRequest tests',()=>{
    let service: FriendsService;
    let mockRepository: RequestInterface;
    let mockPusher: ServiceInterfacePusherFriendsAccept;
    const Ids = {toAdd: 'idToAdd', userId: 'userId'}
    beforeEach(()=>{
        jest.resetAllMocks()
        service = new FriendsService();
        mockRepository = {
            areFriends: jest.fn().mockResolvedValue(false),
            hasExistingFriendRequest: jest.fn().mockResolvedValue(true),
            addToFriends: jest.fn(),
            getUser: jest.fn(),
            removeFriendRequest: jest.fn()
        }
        mockPusher = {
            addFriend: jest.fn()
        }
    })
    it('the ids are already friends, throw an error',  () => {
        mockRepository.areFriends = jest.fn().mockResolvedValue(true)
        expect(service.handleFriendRequest(Ids, mockRepository, mockPusher)).rejects.toEqual('Already Friends');
    });
    it('if there is no existing Friend Request, then throw an error',async ()=>{
        mockRepository.hasExistingFriendRequest = jest.fn().mockResolvedValue(false)
        expect(service.handleFriendRequest(Ids, mockRepository, mockPusher)).rejects.toEqual('No Existing Friend Request');
    })
    it('if no errors, repository.addToFriends, should be called for each participant',async ()=>{
        await service.handleFriendRequest(Ids, mockRepository, mockPusher)
        expect(mockRepository.addToFriends).toHaveBeenCalledWith(Ids.userId, Ids.toAdd)
        expect(mockRepository.addToFriends).toHaveBeenCalledWith(Ids.toAdd, Ids.userId)
    })
    it('if no errors, should trigger the messenger service for live updates',async()=>{
        mockRepository.getUser = jest.fn().mockImplementation(async(id)=>{
            if(id === Ids.userId) return {name: 'user'}
            return {name: 'toAdd'}
        })
        await service.handleFriendRequest(Ids, mockRepository, mockPusher)
        expect(mockPusher.addFriend).toHaveBeenCalledWith(Ids.toAdd, {name: 'user'})
        expect(mockPusher.addFriend).toHaveBeenCalledWith(Ids.userId, {name: 'toAdd'})
    })
    it('should call repo.removeFriendRequest', async ()=>{
        await service.handleFriendRequest(Ids, mockRepository, mockPusher)
        expect(mockRepository.removeFriendRequest).toHaveBeenCalledWith(Ids.userId, Ids.toAdd)
    })
})

describe('UserExists tests',()=>{
    it('the repository confirms the user exists', async ()=>{
        const service = new FriendsService();
        const mockRepository: FriendsAddInterface = {
            userExists: jest.fn().mockResolvedValue(true),
            addToFriendRequests: jest.fn()
        }
        expect(await service.userExists('userId@test.com', mockRepository)).toBe(true)
    })
    it('the repository confirms the user exists', async ()=>{
        const service = new FriendsService();
        const mockRepository: FriendsAddInterface = {
            userExists: jest.fn().mockResolvedValue(true),
            addToFriendRequests: jest.fn()
        }
        await service.userExists('userId@test.com', mockRepository)
        expect(mockRepository.userExists).toHaveBeenCalledWith('userId@test.com')
    })
})
