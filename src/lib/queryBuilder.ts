export default class QueryBuilder {
    static user(userId: string): QueryBuilder {
        return `user:${userId}`
    }
}
