import { Session } from "next-auth"
import { iSessionData } from "../session/interface";
import { sessionDataFactory } from "../session/factory";
import { DashboardDataInterface } from "@/repositories/friends/interfaces";
import { aDashboardData } from "./abstract";

export class DashboardData extends aDashboardData {
    private sessionData: iSessionData
    private friendRequestsRepository: DashboardDataInterface

    constructor(friendRequestsRepository: DashboardDataInterface) {
        super()
        this.sessionData = sessionDataFactory()
        this.friendRequestsRepository = friendRequestsRepository
    }

    async getChatId(participantIds: string[]): Promise<string> {
        return participantIds.sort().join('--');
    }

    async getSession(): Promise<Session> {
        return this.sessionData.getSession()
    }

    async getIncomingFriendRequests(userId: string): Promise<string[]> {
        return this.friendRequestsRepository.getIncomingFriendRequests(userId)
    }

    async getFriendsById(userId: string): Promise<User[]> {
        const friendIds = await this.friendRequestsRepository.getFriends(userId);
        const friends = await Promise.all(friendIds.map(async (id: string) => {
            return this.friendRequestsRepository.getUser(id);
        }));
        return friends;
    }
}