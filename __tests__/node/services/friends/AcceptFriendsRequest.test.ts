import {FriendsAddInterface} from "@/repositories/friends/interfaces";
import {IAcceptFriendPusher} from "@/services/pusher/interfaces";
import {AcceptFriendsService} from "@/services/friends/acceptFriends/service";

describe('handleFriendRequest tests',()=>{
    let service: AcceptFriendsService;
    let mockRepository: FriendsAddInterface;
    let mockPusher: IAcceptFriendPusher;
    const ids: Ids = {sessionId: 'idToAdd', requestId: 'userId'}
    
    beforeEach(()=>{
        jest.resetAllMocks()
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
        service = new AcceptFriendsService(mockRepository, mockPusher);
    })
    
    it('the ids are already friends, throw an error',  () => {
        mockRepository.areFriends = jest.fn().mockResolvedValue(true)
        expect(service.handleFriendRequest(ids)).rejects.toEqual('Already Friends');
    });
    
    it('if there is no existing Friend Request, then throw an error',async ()=>{
        mockRepository.hasExistingFriendRequest = jest.fn().mockResolvedValue(false)
        expect(service.handleFriendRequest(ids)).rejects.toEqual('No Existing Friend Request');
    });
    
    it('if no errors, repository.addToFriends, should be called for each participant',async ()=>{
        await service.handleFriendRequest(ids)
        expect(mockRepository.addToFriends).toHaveBeenCalledWith(ids.sessionId, ids.requestId)
        expect(mockRepository.addToFriends).toHaveBeenCalledWith(ids.requestId, ids.sessionId)
    });
    
    it('if no errors, should trigger the messenger service for live updates',async()=>{
        mockRepository.getUser = jest.fn().mockImplementation(async(id)=>{
            if(id === ids.sessionId) return {name: 'user'}
            return {name: 'toAdd'}
        })
        await service.handleFriendRequest(ids)
        expect(mockPusher.addFriend).toHaveBeenCalledWith(ids.requestId, {name: 'user'})
        expect(mockPusher.addFriend).toHaveBeenCalledWith(ids.sessionId, {name: 'toAdd'})
    });
    
    it('should call repo.removeFriendRequest', async ()=>{
        await service.handleFriendRequest(ids)
        expect(mockRepository.removeFriendRequest).toHaveBeenCalledWith(ids.sessionId, ids.requestId)
    });
})
