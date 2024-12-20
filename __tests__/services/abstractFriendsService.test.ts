import {ServiceFriendsAdd} from "@/services/friends/serviceFriendsAdd";
import {FriendsAbstractInterface} from "@/repositories/friendsRepositoryInterface";
jest.mock("@/lib/myGetServerSession",()=> jest.fn());

describe('getIdToAdd tests',()=>{
    it('should return the id from the repo', async ()=>{
        const service = new ServiceFriendsAdd();
        const mockRepository: FriendsAbstractInterface = {
            getUserId: jest.fn().mockResolvedValue('id'),
            areFriends: jest.fn(),
            hasExistingFriendRequest: jest.fn()
        }
        expect(await service.getIdToAdd('email@test.com', mockRepository)).toBe('id')
    })
})
