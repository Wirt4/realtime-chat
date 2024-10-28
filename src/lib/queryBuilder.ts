export default class QueryBuilder {
    static user(userId: string): string {
        return this._append(userId)
    }

    private static _append( ...args: string[]): string {
        args.unshift('user')
        return args.join(':');
    }

    static friends(userId: string):string{
        return this.join(userId, 'friends')
    }

    static incomingFriendRequests(userId: string): string {
        return this.join(userId, 'incoming_friend_requests')
    }

    static join(userId: string, suffix: string): string {
        return this._append(userId, suffix)
    }

    static email(email: string): string {
       return  this._append('email', email)
    }
}
