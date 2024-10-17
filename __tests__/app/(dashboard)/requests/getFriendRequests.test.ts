import fetchRedis from "@/helpers/redis";
import getFriendRequests from "@/app/(dashboard)/dashboard/requests/getFriendRequests";
import {fetchRedisMock1, fetchRedisMock2} from "../../../../__mocks__/app/(dashboard)/requests/fetchRedismock";
jest.mock("../../../../src/helpers/redis",()=> jest.fn());
describe('getFriendRequests', () => {
    beforeEach(()=>{
        (fetchRedis as jest.Mock).mockResolvedValue([]);
    });

    afterEach(()=>{
        jest.resetAllMocks();
    });

    test('returns an array of objects based off payloads returned from redis',async () => {
       (fetchRedis as jest.Mock).mockImplementation(fetchRedisMock1);

        const expected = [
            {senderId: 'k1234', senderEmail: 'sonny@correlone.edu'},
            {senderId: 'k5678', senderEmail: 'fredo@correlone.edu'},
            {senderId: 'k90123', senderEmail: 'michael@correlone.edu'}
        ]

        const actual = await getFriendRequests('54321');
        expect(actual).toEqual(expected);
    });

    test('returns an array of objects based off payloads returned from redis 2',async () => {
        (fetchRedis as jest.Mock).mockImplementation(fetchRedisMock2);

        const expected = [
            {senderId: 'l1234', senderEmail: 'clemenza@correlone.edu'},
            {senderId: 'l5678', senderEmail: 'tessio@correlone.edu'}
        ]

        const actual = await getFriendRequests('12345')
        expect(actual).toEqual(expected)
    });

    test('first call to fetchRedis should be with args of "user{:sessionid}:incoming_friend_request"',async()=>{
        const sessionId = '1234'
        await getFriendRequests(sessionId)
        expect(fetchRedis.mock.calls).toEqual(
            expect.arrayContaining([['smembers', `user:${sessionId}:incoming_friend_requests`]])
        );
    });

    test('first call to fetchRedis should be with args of "user{:sessionid}:incoming_friend_request"',async()=>{
        const sessionId = '54321'
        await getFriendRequests(sessionId)
        expect(fetchRedis.mock.calls).toEqual(
            expect.arrayContaining([['smembers', `user:${sessionId}:incoming_friend_requests`]])
        );
    });
});
