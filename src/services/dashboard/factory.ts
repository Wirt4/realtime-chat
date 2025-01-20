import { FriendsRepository } from "@/repositories/friends/repository";
import { DashboardData } from "./implementation";
import { DashboardDataInterface } from "@/repositories/friends/interfaces";
import { aDashboardData } from "./abstract";
import { UserRepository } from "@/repositories/user/implementation";
import { FriendRequestsRepository } from "@/repositories/friendRequests/implementation";
import { db } from "@/lib/db";

export function dashboardDataFactory(): aDashboardData {
    const friendsRepo: DashboardDataInterface = new FriendsRepository();
    const userRepository = new UserRepository(db);
    const friendRequestsRepo = new FriendRequestsRepository(db);
    return new DashboardData(friendsRepo, userRepository, friendRequestsRepo);
}
