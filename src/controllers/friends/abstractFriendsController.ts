import myGetServerSession from "@/lib/myGetServerSession";
import {FriendsRepository} from "@/repositories/friendsRepository";
import {ServicePusher} from "@/services/pusher/service";
import {getPusherServer} from "@/lib/pusher";
import {FriendsService} from "@/services/friends/service";

export class AbstractFriendsController {
    protected readonly repository: FriendsRepository;
    protected readonly pusherService: ServicePusher;
    protected service: FriendsService;

    constructor(service: FriendsService){
        this.repository = new FriendsRepository();
        this.pusherService = new ServicePusher(getPusherServer());
        this.service = service;
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
