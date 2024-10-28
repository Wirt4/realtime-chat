import QueryBuilder from "@/lib/queryBuilder";

describe('QueryBuilder.user Test', () => {
    test('Should return user:{id}', () => {
        expect(QueryBuilder.user('1234')).toEqual('user:1234');
    });

    test('Should return user:{id}, different data', () => {
        expect(QueryBuilder.user('frank')).toEqual('user:frank');
    });
});


describe('QueryBuilder.incomingFriendRequests Test', () => {
    test('Should return user:{id}:incoming_friend_requests', () => {
        expect(QueryBuilder.incomingFriendRequests('1234')).toEqual('user:1234:incoming_friend_requests');
    });

    test('Should return user:{id}:incoming_friend_requests', () => {
        expect(QueryBuilder.incomingFriendRequests('frank')).toEqual('user:frank:incoming_friend_requests');
    });
});
