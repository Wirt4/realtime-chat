import QueryBuilder from "@/lib/queryBuilder";

describe('QueryBuilder Test', () => {
    test('Should return user:{id}', () => {
        expect(QueryBuilder.user('1234')).toEqual('user:1234');
    });

    test('Should return user:{id}, different data', () => {
        expect(QueryBuilder.user('frank')).toEqual('user:frank');
    });
});
