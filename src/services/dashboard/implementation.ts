import { iDashboardData } from "./interface";
import { Session } from "next-auth"
import { iSessionData } from "../session/interface";
import { sessionDataFactory } from "../session/factory";

export class DashboardData implements iDashboardData {
    private sessionData: iSessionData
    constructor() {
        this.sessionData = sessionDataFactory()
    }
    async getSession(): Promise<Session> {
        return this.sessionData.getSession()
    }

    getIncomingFriendRequests(userId: string): Promise<string[]> {
        throw new Error("Method not implemented.");
    }

    getFriendsById(userId: string): Promise<User[]> {
        throw new Error("Method not implemented.");
    }

}