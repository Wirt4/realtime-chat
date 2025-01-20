import { FriendsRepository } from "@/repositories/friends/friendsImplementation";
import { DashboardData } from "./implementation";
import { aDashboardData } from "./abstract";
import { UserRepository } from "@/repositories/user/implementation";
import { FriendRequestsRepository } from "@/repositories/friends/requestsImplementation";
import { db } from "@/lib/db";
import { aFriendsRepository } from "@/repositories/friends/abstract";

export function dashboardDataFactory(): aDashboardData {
    const userRepository = new UserRepository(db);
    const friendRequestsRepo = new FriendRequestsRepository(db);
    const friendsRepository: aFriendsRepository = new FriendsRepository(db);
    return new DashboardData(userRepository, friendRequestsRepo, friendsRepository);
}
