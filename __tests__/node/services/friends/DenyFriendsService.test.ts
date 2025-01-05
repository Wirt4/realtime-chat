import {FriendsDenyInterface} from "@/repositories/friends/interfaces";
import {PusherDenyFriendInterface} from "@/services/pusher/interfaces";
import {IDenyFriendsService} from "@/services/friends/deny/interface";
import {DenyFriendsService} from "@/services/friends/deny/service";

describe('deny request tests',()=>{
    let service: IDenyFriendsService;
    let mockRepository: FriendsDenyInterface;
    let mockPusher: PusherDenyFriendInterface
    const ids: Ids = {sessionId:'foo', requestId:'bar'}
    beforeEach(()=>{
        jest.resetAllMocks()
        mockRepository = {
            removeEntry: jest.fn()
        }
        mockPusher = {
            denyFriendRequest: jest.fn()
        }
        service = new DenyFriendsService(mockRepository, mockPusher);
    })

    it('should call the repository deny method', async ()=>{
        await service.removeEntry(ids)
        expect(mockRepository.removeEntry).toHaveBeenCalledWith(ids)
    })

    it('should throw if the repository throws', async () => {
        mockRepository.removeEntry = jest.fn().mockRejectedValue('error')
        service = new DenyFriendsService(mockRepository, mockPusher);
        try{
            await service.removeEntry(ids)
            expect(true).toEqual(false)
        }catch(error){
            expect(error).toEqual('Redis Error')
        }
    })

    it ('should call the pusher deny method', async () => {
        await service.removeEntry(ids)
        expect(mockPusher.denyFriendRequest).toHaveBeenCalledWith(ids.sessionId, ids.requestId)
    })

    it('should throw if the pusher throws', async () => {
        mockPusher.denyFriendRequest = jest.fn().mockRejectedValue('error')
        try{
            await service.removeEntry(ids)
            expect(true).toEqual(false)
        }catch(error){
            expect(error).toEqual('Pusher Error')
        }
    })
})
