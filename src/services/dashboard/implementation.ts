import { iDashboardData } from "./interface";
import { Session } from "next-auth"
import { iSessionData } from "../session/interface";
import { sessionDataFactory } from "../session/factory";
import { DashboardDataInterface } from "@/repositories/friends/interfaces";

export class DashboardData implements iDashboardData {
    private sessionData: iSessionData
    private friendRequestsRepository: DashboardDataInterface

    constructor(friendRequestsRepository: DashboardDataInterface) {
        this.sessionData = sessionDataFactory()
        this.friendRequestsRepository = friendRequestsRepository
    }

    async getSession(): Promise<Session> {
        return this.sessionData.getSession()
    }

    async getIncomingFriendRequests(userId: string): Promise<string[]> {
        return this.friendRequestsRepository.getIncomingFriendRequests(userId)
    }

    async getFriendsById(userId: string): Promise<User[]> {
        const user = await this.friendRequestsRepository.getUser(userId)
        return [user]
    }
}