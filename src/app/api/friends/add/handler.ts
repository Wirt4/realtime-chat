import {addFriendValidator} from "@/lib/validations/add-friend";
import myGetServerSession from "@/lib/myGetServerSession";
import fetchRedis from "@/helpers/redis";
import {db} from "@/lib/db";
import QueryBuilder from "@/lib/queryBuilder";
import {getPusherServer} from "@/lib/pusher";

interface errorProps{
    message: string,
    opts:{
        status: number
    }
}

export class PostFriendsRouteHandler {
    private status: number
    private message: string
    public idToAdd: string
    public senderId: string
    public senderEmail: string

    constructor() {
        this.status = 400
        this.message = 'This person does not exist.'
        this.idToAdd = this.senderEmail = this.senderId= ''
    }

    validateEmail(email:{email:string}){
        return addFriendValidator.parse(email.email);
    }

    setAndReturn(message: string, status: number = 400): boolean{
        this.status = status;
        this.message = message;
        return false;
    }

    async isValidRequest(email:{email:string}):Promise<boolean>{
        //controller work
        try{
            email= this.validateEmail(email)
        }catch{
            return this.setAndReturn('Invalid request payload', 422);
        }

        const userExists = await this.userExists(email.email);

        if (!userExists){
            return this.setAndReturn('This person does not exist.');
        }

        const session = await this.getSession();

        if (!session){
            return this.setAndReturn('unauthorized', 401);
        }

        const isSameUser = this.isSameUser();

        if (isSameUser){
            return this.setAndReturn('You cannot add yourself as a friend');
        }

        const isAlreadyAdded = await this.isAlreadyAdded();

        if (isAlreadyAdded){
            return this.setAndReturn('You\'ve already added this user');
        }

        const areAlreadyFriends = await this.areAlreadyFriends();

        if (areAlreadyFriends){
            return this.setAndReturn("You're already friends with this user");
        }

        return true;
    }

    async userExists(email:string):Promise<boolean>{
        this.idToAdd = await fetchRedis("get",QueryBuilder.email(email));
        return Boolean(this.idToAdd);
    }

    async redisSismember(userId: string, list: 'incoming_friend_requests' | 'friends', queryId:string):Promise<boolean>{
        const result = await fetchRedis("sismember",  QueryBuilder.join(userId, list), queryId) as 0 | 1;
        return Boolean(result);
    }

    async isAlreadyAdded():Promise<boolean>{
        return this.redisSismember(this.idToAdd, 'incoming_friend_requests', this.senderId);
    }

    async areAlreadyFriends():Promise<boolean>{
        return this.redisSismember(this.senderId, 'friends',this.idToAdd);
    }

    async addToDB():Promise<void>{
        await db.sadd(QueryBuilder.incomingFriendRequests(this.idToAdd),this.senderId);
    }

    isSameUser():boolean{
        return this.senderId === this.idToAdd;
    }

    errorResponse(): errorProps{
        return  {
            message:this.message,
            opts: { status: this.status }
        };
    }

    async getSession(){
        const session = await myGetServerSession();
        this.senderId = session?.user?.id as string;
        this.senderEmail= session?.user?.email as string;
        return session;
    }

    async triggerPusherServer(id:string = this.idToAdd, data: dataProps = {senderId: this.senderId, senderEmail: this.senderEmail}){
        const pusherServer = getPusherServer();
        const channel = QueryBuilder.incomingFriendRequestsPusher(id);
        const event = QueryBuilder.incoming_friend_requests;
        await pusherServer.trigger(channel, event, data);
    }
}

interface dataProps {
    senderId: string;
    senderEmail: string;
}
