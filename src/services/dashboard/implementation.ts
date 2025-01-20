import { Session } from "next-auth"
import { sessionDataFactory } from "../session/factory";
import { DashboardDataInterface } from "@/repositories/friends/interfaces";
import { aDashboardData } from "./abstract";
import { SidebarProps } from "@/components/Sidebar/interface";
import { aSessionData } from "../session/abstract";
import { aUserRepository } from "@/repositories/user/abstract";

export class DashboardData extends aDashboardData {
    private sessionData: aSessionData
    private friendRequestsRepository: DashboardDataInterface
    private userRepository: aUserRepository

    constructor(friendRequestsRepository: DashboardDataInterface, userRepository: aUserRepository) {
        super()
        this.sessionData = sessionDataFactory();
        this.friendRequestsRepository = friendRequestsRepository;
        this.userRepository = userRepository;
    }

    async getSession(): Promise<Session> {
        return this.sessionData.getSession()
    }

    async getSidebarProps(session: Session): Promise<SidebarProps> {
        const sessionId = session.user.id;
        const friends = await this.getFriendsById(sessionId);
        const friendRequests = await this.getIncomingFriendRequests(sessionId);
        const userId = session.user.id;
        const chatId = await this.getChatId([userId, ...friends.map(friend => friend.id)]);
        const friendRequestSidebarOptions = this.requestProps(friendRequests, userId);
        const sidebarChatlist = { chatId, sessionId, friends }
        return { friends, friendRequestSidebarOptions, sidebarChatlist };
    }

    private async getChatId(participantIds: string[]): Promise<string> {
        return participantIds.sort().join('--');
    }

    private async getIncomingFriendRequests(userId: string): Promise<string[]> {
        return this.friendRequestsRepository.getIncomingFriendRequests(userId)
    }

    private requestProps(friendRequests: string[], userId: string) {
        return {
            initialRequestCount: friendRequests?.length || 0,
            sessionId: userId
        }
    }

    private async getFriendsById(userId: string): Promise<User[]> {
        const friendIds = await this.friendRequestsRepository.getFriends(userId);
        const friends = await Promise.all(friendIds.map(async (id: string) => {
            return this.userRepository.get(id);
        }));
        return friends;
    }
}
