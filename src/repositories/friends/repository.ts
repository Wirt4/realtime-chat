import {
    DashboardDataInterface,
    FriendsAddInterface,
    FriendsDenyInterface,
    FriendsRemoveInterface,
    RequestInterface,
} from "@/repositories/friends/interfaces";
import fetchRedis from "@/helpers/redis";
import QueryBuilder from "@/lib/queryBuilder";
import { db } from "@/lib/db";
import { Redis } from "@upstash/redis";

export class FriendsRepository implements
    RequestInterface,
    FriendsAddInterface,
    FriendsDenyInterface,
    FriendsRemoveInterface,
    DashboardDataInterface {
    private database: Redis;

    constructor(database = db) {
        this.database = database
    }
    getFriends(userId: string): Promise<string[]> {
        throw new Error("Method not implemented.");
    }

    getIncomingFriendRequests(userId: string): Promise<string[]> {
        return this.database.smembers('user:xavier:incoming_friend_requests');
    }

    async areFriends(userId: string, idToAdd: string): Promise<boolean> {
        return this.queryFriendsTable(userId, idToAdd);
    }

    async hasExistingFriendRequest(userId: string, idToAdd: string): Promise<boolean> {
        return this.queryFriendRequestsTable(userId, idToAdd);
    }

    async addToFriends(userId: string, idToAdd: string): Promise<void> {
        await Promise.all([
            this.database.sadd(this.friendsTable(userId), idToAdd),
            this.database.sadd(this.friendsTable(idToAdd), userId)
        ]);
    }

    async getUser(userId: string): Promise<User> {
        const user: string = await fetchRedis('get', QueryBuilder.user(userId));
        return user ? JSON.parse(user) : {} as User;
    }

    queryFriendsTable(userId: string, idToAdd: string): Promise<boolean> {
        return this.queryTable(userId, idToAdd, this.friendsTable);
    }

    queryFriendRequestsTable(userId: string, idToAdd: string): Promise<boolean> {
        return this.queryTable(userId, idToAdd, this.incomingRequestsQuery);
    }

    queryTable(userId: string, idToAdd: string, queryFunction: (id: string) => string): Promise<boolean> {
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
        const idToAdd = await this.getUserId(email)
        return Boolean(idToAdd)
    }

    async getUserId(email: string): Promise<string> {
        return fetchRedis('get', QueryBuilder.email(email))
    }

    async removeEntry(ids: Ids): Promise<void> {
        await this.database.srem(QueryBuilder.incomingFriendRequests(ids.sessionId), ids.requestId)
    }

    async removeFriend(userId: string, idToRemove: string): Promise<void> {
        await this.database.srem(`user:${userId}:friends`, idToRemove)
    }
}
