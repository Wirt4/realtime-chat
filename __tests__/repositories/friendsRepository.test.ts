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
    it('getUser, returns result from fetchRedis',  () => {
        (fetchRedis as jest.Mock).mockResolvedValue({name: 'John Doe'});
        expect(repo.getUser('foo')).resolves.toEqual({name: 'John Doe'});
    })
    it('getUser, arguments to fetchRedis',  async () => {
        await repo.getUser('foo');
        expect(fetchRedis as jest.Mock).toHaveBeenCalledWith('get', 'user:foo')
    })
    it('removeFriendRequest', async () => {
        const mockDB = {srem: jest.fn()};
        repo = new FriendsRepository(mockDB as Redis)
        await repo.removeFriendRequest('id1', 'id2');
        expect(mockDB.srem).toHaveBeenCalledWith( "user:id1:incoming_friend_requests",  "id2")
    })
})

describe('addToFriendRequests', () => {
    it('should call sadd with correct arguments', async () => {
        const mockDB = {sadd: jest.fn()};
       const  repo = new FriendsRepository(mockDB as Redis)
        await repo.addToFriendRequests('id1', 'id2');
        expect(mockDB.sadd).toHaveBeenCalledWith(  "user:id2:incoming_friend_requests",  'id1')
    })
})

describe('userExists', () => {
    beforeEach(()=>{
        jest.resetAllMocks()
    })
    it('should return true if fetchRedis returns a value', async () => {
        (fetchRedis as jest.Mock).mockResolvedValue('foo');
        const repo = new FriendsRepository();
        expect(repo.userExists('foo')).resolves.toBe(true)
    })
    it('should return false if fetchRedis returns null', async () => {
        (fetchRedis as jest.Mock).mockResolvedValue(null);
        const repo = new FriendsRepository();
        expect(repo.userExists('foo')).resolves.toBe(false)
    })
    it('should call fetchRedis with correct arguments', async () => {
        const repo = new FriendsRepository();
        await repo.userExists('foo');
        expect(fetchRedis as jest.Mock).toHaveBeenCalledWith('get', 'user:email:foo')
    })
})

describe('getUserId', () => {
    it('should return an empty string', async () => {
        (fetchRedis as jest.Mock).mockResolvedValue('foo');
        const repo = new FriendsRepository();
        expect(repo.getUserId('email')).resolves.toBe('foo');
    })
})
