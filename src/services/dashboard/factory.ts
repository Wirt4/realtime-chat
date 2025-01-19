import { FriendsRepository } from "@/repositories/friends/repository";
import { iDashboardData } from "./interface";
import { DashboardData } from "./implementation";
import { DashboardDataInterface } from "@/repositories/friends/interfaces";

export function dashboardDataFactory(): iDashboardData {
    const repo: DashboardDataInterface = new FriendsRepository();
    return new DashboardData(repo);
}