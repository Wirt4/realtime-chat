import {IAddFriendsService} from "@/services/friends/add/interface";
import {IAddFriendsRepository} from "@/repositories/friends/interfaces";
import {AddFriendsService} from "@/services/friends/add/service";
import {PusherAddFriendInterface} from "@/services/pusher/interfaces";

describe('AddFriends Service Tests', () => {
    let service: IAddFriendsService
    let repository: IAddFriendsRepository
    let pusher:PusherAddFriendInterface
    let ids: Ids
    let email: string

    beforeEach(()=> {
        ids = {sessionId: 'foo', requestId: 'bar'}
        email = 'email@example.com'
        repository = {
            addToFriendRequests: jest.fn(),
            areFriends: jest.fn(),
            hasExistingFriendRequest: jest.fn(),
            getUserId: jest.fn(),
            userExists: jest.fn()
        }
        pusher = {addFriendRequest: jest.fn()}
        service = new AddFriendsService(repository, pusher)
    });

    it('handleFriendAdd should call the repository', async ()=>{
        await service.handleFriendAdd(ids, email)
        expect(repository.addToFriendRequests).toHaveBeenCalledWith(ids.sessionId, ids.requestId)
    });

    it('handleFriendAdd should call the pusher service', async ()=>{
        await service.handleFriendAdd(ids, email)
        expect(pusher.addFriendRequest).toHaveBeenCalledWith(ids.sessionId, ids.requestId, email)
    });

    it('Are already friends', async ()=>{
        jest.spyOn(repository, 'areFriends').mockResolvedValue(false)
        service = new AddFriendsService(repository, pusher)
        expect(await service.areAlreadyFriends(ids)).toBe(false)
    })

    it('areFriends: should call repository with ids', async ()=>{
        await service.areAlreadyFriends(ids)
        expect(repository.areFriends).toHaveBeenCalledWith(ids.sessionId, ids.requestId)
    })

    it('already in requests, should call repo with ids', async () => {
        await service.isAlreadyAddedToFriendRequests(ids)
        expect(repository.hasExistingFriendRequest).toHaveBeenCalledWith(ids.sessionId, ids.requestId)
    });

    it('return result of repository.isAlreadyAddedToFriendRequests', async () => {
        jest.spyOn(repository, 'hasExistingFriendRequest').mockResolvedValue(true)
        expect(await service.isAlreadyAddedToFriendRequests(ids)).toEqual(true)
    });

    it('isSameUser: should return true', () => {
        expect(service.isSameUser({sessionId: 'Ayn', requestId: 'Ayn'})).toBe(true)
    })

    it('getIdToAdd: returns value returned by repository', async () => {
        const id = 'retrievedUserId'
        jest.spyOn(repository, 'getUserId').mockResolvedValue(id)
        expect(await service.getIdToAdd(email)).toEqual(id)
    })

    it('userExists: should return result from repository', async () => {
        jest.spyOn(repository, 'userExists').mockResolvedValue(true)
        expect(await service.userExists(email)).toEqual(true)
    })
})
