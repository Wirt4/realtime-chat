import {RemoveFriendService} from "@/services/friends/remove/service";
import {IRemoveFriendsRepository} from "@/repositories/friends/interfaces";

describe('RemoveFriendService', () => {
    let repository: IRemoveFriendsRepository
    let service: RemoveFriendService
    const ids = {sessionId: '1', requestId: '2'}

    beforeEach(() => {
        repository= {
            removeFriend: jest.fn(),
            areFriends: jest.fn()
        }
    })

    it('areAlready Friends', async () => {
        jest.spyOn(repository, 'areFriends').mockResolvedValue(false)
        service = new RemoveFriendService(repository)
        expect(await service.areAlreadyFriends(ids)).toEqual(false)
    })

    it('areAlready Friends', async () => {
        service = new RemoveFriendService(repository)
        await service.areAlreadyFriends(ids)
        expect(repository.areFriends).toHaveBeenCalledWith(ids.sessionId, ids.requestId)
    })

    it('should call the respitory removeFriend function twice',async () => {
        service = new RemoveFriendService(repository)
        await service.removeFriends(ids)
        expect(repository.removeFriend).toHaveBeenCalledTimes(2)
        expect(repository.removeFriend).toHaveBeenCalledWith(ids.sessionId, ids.requestId)
        expect(repository.removeFriend).toHaveBeenCalledWith(ids.requestId, ids.sessionId)
    });
})
