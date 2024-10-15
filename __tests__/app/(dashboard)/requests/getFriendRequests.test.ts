import fetchRedis from "@/helpers/redis";
import getFriendRequests from "@/app/(dashboard)/dashboard/requests/getFriendRequests";
jest.mock("../../../../src/helpers/redis",()=> jest.fn());
describe('getFriendRequests', () => {
    beforeEach(()=>{
        (fetchRedis as jest.Mock).mockResolvedValue([]);
    });

    afterEach(()=>{
        jest.resetAllMocks();
    });

    test('returns an array of objects based off payloads retrned from redis',async () => {
       (fetchRedis as jest.Mock).mockImplementation(async(cmd:string, query:string)=>{
           if (cmd ==='smembers'){
               return['k1234','k5678', 'k90123' ]
           }
           const users: {[index: string]:User}  = {
               'user:k1234': {
                   name: "Santino",
                   email: 'sonny@correlone.edu',
                   image: 'stub',
                   id:'k1234'
               },
               'user:k5678':{
                   name: "Freddie the Fisher",
                   email: 'fredo@correlone.edu',
                   image: 'stub',
                   id:'k5678'
               },
               'user:k90123':{
                   name: "Michael",
                   email: 'michael@correlone.edu',
                   image: 'stub',
                   id:'k90123'
               }
           }
           return users[query]
       });

        const expected = [
            {senderId: 'k1234', senderEmail: 'sonny@correlone.edu'},
            {senderId: 'k5678', senderEmail: 'fredo@correlone.edu'},
            {senderId: 'k90123', senderEmail: 'michael@correlone.edu'}
        ]

        const actual = await getFriendRequests('54321');
        expect(actual).toEqual(expected);
    });

    test('returns an array of objects based off payloads returned from redis 2',async () => {
        (fetchRedis as jest.Mock).mockImplementation(async(cmd:string, query:string)=>{
            if (cmd ==='smembers'){
                return['l1234','l5678' ]
            }
            const users: {[index: string]:User}  = {
                'user:l1234': {
                    name: "Clemenza",
                    email: 'clemenza@correlone.edu',
                    image: 'stub',
                    id:'l1234'
                },
                'user:l5678':{
                    name: "Tessio",
                    email: 'tessio@correlone.edu',
                    image: 'stub',
                    id:'l5678'
                }
            }
            return users[query]
        })

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
});
