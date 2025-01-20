import { FriendsRepository } from "@/repositories/friends/repository";
import { DashboardData } from "./implementation";
import { DashboardDataInterface } from "@/repositories/friends/interfaces";
import { aDashboardData } from "./abstract";

export function dashboardDataFactory(): aDashboardData {
    const repo: DashboardDataInterface = new FriendsRepository();
    return new DashboardData(repo);
}