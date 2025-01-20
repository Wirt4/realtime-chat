import { Session } from "next-auth"
import { iSessionData } from "../session/interface";
import { sessionDataFactory } from "../session/factory";
import { DashboardDataInterface } from "@/repositories/friends/interfaces";
import { aDashboardData } from "./abstract";
import { SidebarProps } from "@/components/Sidebar/interface";
import SidebarChatList from "@/components/Sidebar/ChatList/SidebarChatList";

export class DashboardData extends aDashboardData {
    private sessionData: iSessionData
    private friendRequestsRepository: DashboardDataInterface

    constructor(friendRequestsRepository: DashboardDataInterface) {
        super()
        this.sessionData = sessionDataFactory()
        this.friendRequestsRepository = friendRequestsRepository
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
            return this.friendRequestsRepository.getUser(id);
        }));
        return friends;
    }
}
