export default class QueryBuilder {
    static user(userId: string): string {
        return this._append(userId)
    }

    private static _joinQuery(...args: string[]): string{
        return args.join(':');
    }

    private static _append( ...args: string[]): string {
        args.unshift('user')
        return this._joinQuery(...args);
    }

    static friends(userId: string):string{
        return this.join(userId, 'friends')
    }

    static friendsPusher(userId: string):string{
        return this.toPusherKey(this.friends(userId))
    }

    static messages(chatId: string):string{
        return this._joinQuery('chat', chatId, 'messages')
    }

    static incomingFriendRequests(userId: string): string {
        return this.join(userId, this.incoming_friend_requests)
    }

    static join(userId: string, suffix: string): string {
        return this._append(userId, suffix)
    }

    static email(email: string): string {
       return  this._append('email', email)
    }

    static incomingFriendRequestsPusher(userId: string):string {
        return this.toPusherKey(this.incomingFriendRequests(userId))
    }

    static toPusherKey(query: string):string{
        return query.replace(/:/g, '__')
    }

    static get incoming_friend_requests () {
        return 'incoming_friend_requests'
    }
}
