import {FriendsService} from "@/services/friendsService";
import {RequestInterface} from "@/repositories/friendsRepositoryInterface";
import {PusherServiceInterface} from "@/services/pusherServiceInterface";
jest.mock("@/lib/myGetServerSession",()=> jest.fn());

describe('handleFriendRequest tests',()=>{
    let service: FriendsService;
    let mockRepository: RequestInterface;
    let mockPusher: PusherServiceInterface;
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
            triggerPusher: jest.fn()
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
        expect(mockPusher.triggerPusher).toHaveBeenCalledWith(Ids.toAdd, {name: 'user'})
        expect(mockPusher.triggerPusher).toHaveBeenCalledWith(Ids.userId, {name: 'toAdd'})
    })
    it('should call repo.removeFriendRequest', async ()=>{
        await service.handleFriendRequest(Ids, mockRepository, mockPusher)
        expect(mockRepository.removeFriendRequest).toHaveBeenCalledWith(Ids.userId, Ids.toAdd)
    })
})

describe('handleFriendAdd tests',()=>{
    it('the repository should add the friend request',async ()=>{
        const service = new FriendsService();
        const mockRepository = {
            addToFriendRequests: jest.fn(),
        }
        await service.handleFriendAdd('userId', 'idToAdd', mockRepository)
        expect(mockRepository.addToFriendRequests).toHaveBeenCalledWith('userId', 'idToAdd')
    })
})
