import { UserRepository } from "@/repositories/user/implementation";
import { db } from "@/lib/db";
import { FriendsRepository } from "@/repositories/friends/friendsImplementation";
import { FriendRequestsRepository } from "@/repositories/friends/requestsImplementation";
import { ServicePusher } from "../pusher/service";
import { getPusherServer } from "@/lib/pusher";
import { FriendsService } from "./service";

//Band-aid solution, but right now am committing any sin to get this to work
export function friendsServiceFactory() {
    const userRepository = new UserRepository(db);
    const friendsRepository = new FriendsRepository(db);
    const friendsRequestRepository = new FriendRequestsRepository(db);
    const pusher = new ServicePusher(getPusherServer());
    return new FriendsService(
        userRepository,
        friendsRepository,
        friendsRequestRepository,
        pusher,
        pusher,
        pusher
    );
}   
