import myGetServerSession from "@/lib/myGetServerSession";
import {FriendsRepository} from "@/repositories/friends/repository";
import {ServicePusher} from "@/services/pusher/service";
import {getPusherServer} from "@/lib/pusher";

export class AbstractFriendsController {
    protected readonly repository: FriendsRepository;
    protected readonly pusherService: ServicePusher;

    constructor(){
        this.repository = new FriendsRepository();
        this.pusherService = new ServicePusher(getPusherServer());
    }

    async getUserId(): Promise<string | boolean> {
        const session = await myGetServerSession();
        return session?.user.id || false
    }

    respond(message: string, status: number): Response {
        return new Response(message, {status}) as Response
    }

    unauthorized(): Response {
        return this.respond('Unauthorized', 401)
    }

    ok(): Response {
        return this.respond('OK', 200)
    }
}
