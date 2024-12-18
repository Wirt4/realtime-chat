import {FriendsRepository} from "@/repositories/friendsRepository";
import fetchRedis from "@/helpers/redis";
import {Redis} from "@upstash/redis";

jest.mock("@/helpers/redis")

describe('friendsRequestRepository tests', () => {
    let repo: FriendsRepository;

    beforeEach(()=>{
        jest.resetAllMocks();
        repo = new FriendsRepository()
    })
    it('should query redis to determine if ids are friends or not, fetchRedis returns true', async () => {
        (fetchRedis as jest.Mock).mockResolvedValue(true);
        const areFriends = await repo.areFriends('id1', 'id2')
        expect(areFriends).toBe(true)
    })
    it('should query redis to determine if ids are friends or not, fetRedis returns false', async () => {
        (fetchRedis as jest.Mock).mockResolvedValue(false);
        const areFriends = await repo.areFriends('id1', 'id2');
        expect(areFriends).toBe(false)
    })
    it('fetchRedis should be called with correct arguments', async () => {
        await repo.areFriends('id1', 'id2');
        expect(fetchRedis as jest.Mock).toHaveBeenCalledWith('sismember', 'user:id1:friends', 'id2')
    })
    it('hasExistingFriendRequest', async () => {
       await repo.hasExistingFriendRequest('id1', 'id2');
       expect(fetchRedis as jest.Mock).toHaveBeenCalledWith('sismember', 'user:id1:incoming_friend_requests', 'id2')
    })
    it('addToFriendsTables', async () => {
        const mockDB = {sadd: jest.fn()};
        repo = new FriendsRepository(mockDB as Redis)
        await repo.addToFriends('id1', 'id2');
        expect(mockDB.sadd).toHaveBeenCalledWith( "user:id1:friends",  "id2")
        expect(mockDB.sadd).toHaveBeenCalledWith( "user:id2:friends",  "id1")
    })
})
