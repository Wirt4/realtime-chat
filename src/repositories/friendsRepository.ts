import {FriendsRepositoryInterface} from "@/repositories/friendsRepositoryInterface";
import fetchRedis from "@/helpers/redis";
import QueryBuilder from "@/lib/queryBuilder";
import {undefined} from "zod";
import {db} from "@/lib/db";
import {Redis} from "@upstash/redis";

export class FriendsRepository implements FriendsRepositoryInterface{
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

    queryFriendsTable(userId: string, idToAdd): Promise<boolean> {
        return this.queryTable(userId, idToAdd, this.friendsTable);
    }

    queryFriendRequestsTable(userId: string, idToAdd: string): Promise<boolean> {
        return this.queryTable(userId, idToAdd, this.incomingRequestsQuery);
    }

    queryTable(userId: string, idToAdd: string, queryFunction: Function): Promise<boolean> {
        return fetchRedis('sismember', queryFunction(userId), idToAdd);
    }

    friendsTable(id: string): string {
        return QueryBuilder.join(id, 'friends');
    }

    getUser(userId: string): Promise<any> {
        return Promise.resolve(undefined);
    }

    incomingRequestsQuery(id: string): string {
        return QueryBuilder.join(id, 'incoming_friend_requests');
    }
}
