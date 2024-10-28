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

describe('QueryBuilder.join Test', () => {
    test('Should return user:dracula:friends', () => {
        expect(QueryBuilder.join('dracula', 'friends')).toEqual('user:dracula:friends');
    });
    test('Should return user:dracula:incoming_friend_requests', () => {
        expect(QueryBuilder.join('dracula', 'incoming_friend_requests')).toEqual('user:dracula:incoming_friend_requests');
    });

    test('Should return user:frankenstein:friends', () => {
        expect(QueryBuilder.join('frankenstein', 'incoming_friend_requests')).toEqual('user:frankenstein:incoming_friend_requests');
    });

});
