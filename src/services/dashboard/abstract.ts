import { Session } from "next-auth";

export abstract class aDashboardData {
    abstract getSession(): Promise<Session>
    abstract getIncomingFriendRequests(userId: string): Promise<string[]>
    abstract getFriendsById(userId: string): Promise<User[]>
    abstract getChatId(participantIds: string[]): Promise<string>
}