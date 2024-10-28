import QueryBuilder from "@/lib/queryBuilder";

describe('QueryBuilder Test', () => {
    test('Should return user:{id}', () => {
        expect(QueryBuilder.user('1234')).toEqual('user:1234')
    })
})
