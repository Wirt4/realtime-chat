import { ServicePusher } from "@/services/pusher/service";
import { getPusherServer } from "@/lib/pusher";
import { AbstractController } from "@/controllers/abstractController";

export abstract class AbstractFriendsController extends AbstractController {
    protected readonly pusherService: ServicePusher;

    constructor() {
        super();
        this.pusherService = new ServicePusher(getPusherServer());
    }
}
