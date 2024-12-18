import {friendSchema} from "@/schemas/friendSchema";
import {FriendRequestStatus, FriendsService} from "@/services/friendsService";
import myGetServerSession from "@/lib/myGetServerSession";
import {FriendsRepository} from "@/repositories/friendsRepository";
import {PusherService} from "@/services/pusherService";
import {getPusherServer} from "@/lib/pusher";



export class FriendsController{
    private service: FriendsService;

    constructor(service: FriendsService){
        this.service = service;
    }

    async acceptFriendRequest(request: Request):Promise<Response> {
        const idToAdd = await this.getIdToAdd(request);

        if (!idToAdd) {
            return this.respond('Invalid ID', 422)
        }

        const userId =  await this.getUserId();

        if (!userId) {
            return this.respond('Unauthorized', 401)
        }

        try{
            await this.handle(userId, idToAdd);
        }catch (error){
            if (this.isKnownError(error)) {
                return this.respond(error, 400)
            }else{
                return this.respond(error.toString(), 500)
            }
        }
        return this.respond('OK', 200);
    }

    isKnownError(error: any): boolean {
        return typeof error == 'string' && Object.values(FriendRequestStatus).includes(error)
    }

    async handle(userId: string|boolean, toAdd: string|boolean): Promise<void> {
        const ids = {userId: userId.toString(), toAdd: toAdd.toString()}
        const pusherServer = getPusherServer()
        const pusherService = new PusherService(pusherServer)
        return  this.service.handleFriendRequest(ids, new FriendsRepository(), pusherService);
    }

    respond(message: string, status: number): Response {
        return new Response(message, {status}) as Response
    }

     async getIdToAdd(request: Request):Promise <string | boolean> {
         const body = await request.json();
        try {
            const { id: idToAdd } = friendSchema.parse(body);
            return idToAdd;
        } catch {
            return false;
        }
    }

    async getUserId(): Promise<string | boolean> {
        const session = await myGetServerSession();
        return session?.user.id || false
    }
}
