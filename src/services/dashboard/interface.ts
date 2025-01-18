import { Session } from "next-auth";

export interface iDashboardData {
    getSession(): Promise<Session>
    getIncomingFriendRequests(userId: string): Promise<string[]>
    getFriendsById(userId: string): Promise<User[]>
}