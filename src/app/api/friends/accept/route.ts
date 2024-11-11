import {z} from 'zod'
import myGetServerSession from "@/lib/myGetServerSession";
import fetchRedis from "@/helpers/redis";
import {db} from "@/lib/db";
import QueryBuilder from "@/lib/queryBuilder";
import {getPusherServer} from "@/lib/pusher";
import Pusher from "pusher";

export async function POST(request: Request):Promise<Response> {
    const idToAdd = await getIdToAdd(request);

    if (!idToAdd) {
        return respond('Invalid Request', 422);
    }

    const userId = await getUserId();
    if (!userId) {
        return respond('Unauthorized', 401);
    }

    const handler = new Handler(idToAdd as string, userId as string);
    const areAlreadyFriends: boolean = await handler.areFriends();

    if (areAlreadyFriends) {
        return respond('Already Friends', 400);
    }

    const hasExistingFriendRequest = await handler.isInRequests();

    if (!hasExistingFriendRequest) {
        return respond('No Existing Friend Request', 400);
    }

    await handler.triggerPusher()
    await handler.addToFriendsTables();
    await handler.removeRequestFromTable();
    return new Response('OK');
}

class Handler{
    idToAdd: string;
    userId: string;

    constructor(idToAdd: string, userId: string) {
        this.idToAdd = idToAdd;
        this.userId = userId;
    }

    async triggerPusher(){
        const pusherServer =new PusherServerWrapper()
        await Promise.all([
            pusherServer.trigger(this.userId, this.idToAdd),
            pusherServer.trigger(this.idToAdd, this.userId)
        ])
    }

    async areFriends(): Promise<boolean>{
        return this.fetchRedisTemplate(this.friendsTable());
    }

    async isInRequests(): Promise<boolean>{
        return this.fetchRedisTemplate(this.incomingRequestsQuery());
    }

    async fetchRedisTemplate(table: string): Promise<boolean>{
        return  fetchRedis('sismember', table, this.idToAdd);
    }

    async addToFriendsTables():Promise<void>{
        await Promise.all([
            this.addToFriendsTable(this.userId, this.idToAdd),
            this.addToFriendsTable(this.idToAdd, this.userId)
        ])
    }

    async removeRequestFromTable():Promise<void>{
        await db.srem(this.incomingRequestsQuery(), this.idToAdd);
    }

    friendsTable(id: string = this.userId): string {
        return this.userTable(id, 'friends');
    }

    incomingRequestsQuery(): string {
        return this.userTable(this.userId, 'incoming_friend_requests');
    }

    async addToFriendsTable(userId: string = this.userId, idToAdd: string = this.idToAdd):Promise<void>{
        await db.sadd(this.friendsTable(userId), idToAdd);
    }

    userTable(id: string, suffix: 'friends'| 'incoming_friend_requests'){
        return QueryBuilder.join(id, suffix);
    }
}

class PusherServerWrapper {
    pusher: Pusher
    constructor() {
        this.pusher = getPusherServer()
    }

    async trigger(senderId: string, recipientId: string){
        const channel = QueryBuilder.friendsPusher(senderId)
        const user = await fetchRedis('get', QueryBuilder.user(recipientId))
        await this.pusher.trigger(channel, QueryBuilder.new_friend, user)
    }
}

function respond(text: string, status: number): Response
{
    return  new Response(text, {status: status});
}

async function getUserId(): Promise<string | boolean>{
    const session = await myGetServerSession();
    return session?.user?.id || false;
}

async function getIdToAdd(request: Request):Promise<string | boolean> {
    const body = await request.json();
    try{
        const { id: idToAdd } =  z.object({id: z.string()}).parse(body);
        return idToAdd;
    }catch{
        return false;
    }
}
