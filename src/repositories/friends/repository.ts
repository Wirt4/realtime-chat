import {FriendsAddInterface, RequestInterface} from "@/repositories/friends/interfaces";
import fetchRedis from "@/helpers/redis";
import QueryBuilder from "@/lib/queryBuilder";
import {db} from "@/lib/db";
import {Redis} from "@upstash/redis";

export class FriendsRepository implements RequestInterface, FriendsAddInterface{
    private database: Redis;
    constructor(database = db) {
        this.database=database
    }
    async areFriends(userId:string, idToAdd: string): Promise<boolean>{
        return this.queryFriendsTable(userId, idToAdd);
    }

    async hasExistingFriendRequest(userId:string, idToAdd: string): Promise<boolean>{
        return this.queryFriendRequestsTable(userId, idToAdd);
    }

    async addToFriends(userId:string, idToAdd: string): Promise<void>{
        await Promise.all([
            this.database.sadd(this.friendsTable(userId), idToAdd),
            this.database.sadd(this.friendsTable(idToAdd), userId)
        ]);
    }

    getUser(userId: string): Promise<User>{
        return fetchRedis('get', QueryBuilder.user(userId))
    }

    queryFriendsTable(userId: string, idToAdd:string): Promise<boolean> {
        return this.queryTable(userId, idToAdd, this.friendsTable);
    }

    queryFriendRequestsTable(userId: string, idToAdd: string): Promise<boolean> {
        return this.queryTable(userId, idToAdd, this.incomingRequestsQuery);
    }

    queryTable(userId: string, idToAdd: string, queryFunction: (id: string)=> string): Promise<boolean> {
        return fetchRedis('sismember', queryFunction(userId), idToAdd);
    }

    friendsTable(id: string): string {
        return QueryBuilder.join(id, 'friends');
    }

    incomingRequestsQuery(id: string): string {
        return QueryBuilder.join(id, 'incoming_friend_requests');
    }

    async removeFriendRequest(userId: string, idToAdd: string): Promise<void> {
        await this.database.srem(this.incomingRequestsQuery(userId), idToAdd);
    }

    async addToFriendRequests(userId: string, idToAdd: string): Promise<void> {
        await this.database.sadd(QueryBuilder.incomingFriendRequests(idToAdd), userId);
    }

    async userExists(email: string): Promise<boolean> {
        return !!(await fetchRedis('get', QueryBuilder.email(email)));
    }

    getUserId(email: string): Promise<string> {
        return fetchRedis('get', QueryBuilder.email(email))
    }
}
