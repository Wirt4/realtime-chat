import {friendSchema} from "@/schemas/friendSchema";
import {ServiceFriendsAdd} from "@/services/friends/serviceFriendsAdd";
import myGetServerSession from "@/lib/myGetServerSession";
import {FriendsRepository} from "@/repositories/friendsRepository";
import {ServicePusher} from "@/services/pusher/ServicePusher";
import {getPusherServer} from "@/lib/pusher";
import {ServiceFriendsAbstract} from "@/services/friends/abstractFriendsService";

export class AbstractFriendsController {
    protected service: ServiceFriendsAbstract;
    protected readonly repository: FriendsRepository;
    protected readonly pusherService: ServicePusher;

    constructor(service: ServiceFriendsAbstract){
        this.service = service;
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
