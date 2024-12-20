import {Ids} from "@/services/friends/FriendsService";
import {ServiceInterfacePusherFriendsAccept} from "@/services/pusher/ServiceInterfacePusherFriendsAccept";
import {FriendsAddInterface} from "@/repositories/friendsRepositoryInterface";

export interface ServiceFriendsInterfaceAccept{
    handleFriendRequest(ids: Ids, friendsRepository: FriendsAddInterface, pusherService: ServiceInterfacePusherFriendsAccept): Promise<void>;
}