export default class QueryBuilder {
    static user(userId: string): string {
        return `user:${userId}`;
    }

    static incomingFriendRequests(userId: string): string {
        return `${this.user(userId)}:incoming_friend_requests`
    }

    static join(userId: string, suffix: string): string {
        return 'user:dracula:' + suffix;
    }
}
