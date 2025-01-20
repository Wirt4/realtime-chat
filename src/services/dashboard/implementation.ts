import { Session } from "next-auth"
import { aDashboardData } from "./abstract";
import { SidebarProps } from "@/components/Sidebar/interface";
import { aSessionData } from "../session/abstract";
import { aUserRepository } from "@/repositories/user/abstract";
import { sessionDataFactory } from "../session/factory";
import { aFriendsRepository } from "@/repositories/friends/abstract";

export class DashboardData extends aDashboardData {
    private sessionData: aSessionData
    private userRepository: aUserRepository
    private friendRequestsRepository: aFriendsRepository
    private friendsRepository: aFriendsRepository

    constructor(userRepository: aUserRepository, friendRequestsRepository: aFriendsRepository, friendsRepository: aFriendsRepository) {
        super()
        this.sessionData = sessionDataFactory();
        this.userRepository = userRepository;
        this.friendRequestsRepository = friendRequestsRepository;
        this.friendsRepository = friendsRepository;
    }

    async getSession(): Promise<Session> {
        return this.sessionData.getSession()
    }

    async getSidebarProps(session: Session): Promise<SidebarProps> {
        const sessionId = session.user.id;
        const friends = await this.getFriendsById(sessionId);
        const friendRequests = await this.friendRequestsRepository.get(sessionId);
        const userId = session.user.id;
        const chatId = await this.getChatId([userId, ...friends.map(friend => friend.id)]);
        const friendRequestSidebarOptions = this.requestProps(friendRequests, userId);
        const sidebarChatlist = { chatId, sessionId, friends }
        return { friends, friendRequestSidebarOptions, sidebarChatlist };
    }

    private async getChatId(participantIds: string[]): Promise<string> {
        return participantIds.sort().join('--');
    }

    private requestProps(friendRequests: string[], userId: string) {
        return {
            initialRequestCount: friendRequests?.length || 0,
            sessionId: userId
        }
    }

    private async getFriendsById(userId: string): Promise<User[]> {
        const friendIds = await this.friendsRepository.get(userId);
        const friends = await Promise.all(friendIds.map(async (id: string) => {
            return this.userRepository.getUser(id);
        }));
        return friends;
    }
}
