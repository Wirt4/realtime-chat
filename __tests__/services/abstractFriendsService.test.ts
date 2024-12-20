import {ServiceFriendsAdd} from "@/services/friends/serviceFriendsAdd";
import {FriendsAbstractInterface} from "@/repositories/friendsRepositoryInterface";
import {FriendsService} from "@/services/friends/FriendsService";
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
