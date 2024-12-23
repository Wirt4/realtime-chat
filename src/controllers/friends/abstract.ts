import {FriendsRepository} from "@/repositories/friends/repository";
import {ServicePusher} from "@/services/pusher/service";
import {getPusherServer} from "@/lib/pusher";
import {AbstractController} from "@/controllers/abstractController";

export abstract class AbstractFriendsController extends AbstractController{
    protected readonly repository: FriendsRepository;
    protected readonly pusherService: ServicePusher;

    constructor(){
        super();
        this.repository = new FriendsRepository();
        this.pusherService = new ServicePusher(getPusherServer());
    }
}
