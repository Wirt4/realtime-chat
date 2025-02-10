import { Session } from "next-auth"
import { aDashboardData } from "./abstract";
import { SidebarProps } from "@/components/Sidebar/interface";
import { aSessionData } from "../session/abstract";
import { sessionDataFactory } from "../session/factory";
import { SidebarChatListItemProps } from "@/components/Sidebar/ChatListItem/interface";
import { FriendRequestSidebarOptionsProps } from "@/components/Sidebar/SidebarOptions/friendRequestSidebarOptions/interface";
import { SidebarChatListProps } from "@/components/Sidebar/ChatList/interface";
import { aDashboardFacade } from "@/repositories/dashboardFacade/abstact";

export class DashboardData extends aDashboardData {
    private sessionData: aSessionData
    private facade: aDashboardFacade


    constructor(facade: aDashboardFacade) {
        super()
        this.sessionData = sessionDataFactory();
        this.facade = facade;
    }

    async getSession(): Promise<Session> {
        return this.sessionData.getSession()
    }

    async getSidebarProps(session: Session): Promise<SidebarProps> {
        const sessionId = session.user.id;
        const asyncData = await this.getAsyncData(sessionId);

        const friendsListProps = { friends: asyncData.friendProfiles };
        const hasFriends = asyncData.friends.length > 0;
        const hasActiveChats = asyncData.friends.length > 0;
        const friendRequestSidebarOptionsProps = this.getFriendRequestSidebarOptionsProps(sessionId, asyncData.friendRequests);
        const sidebarChatlistProps = this.sidebarChatlistProps(sessionId, asyncData.sessionUser, asyncData.friends);

        return {
            hasFriends,
            hasActiveChats,
            friendRequestSidebarOptionsProps,
            sidebarChatlistProps,
            friendsListProps,
        };
    }

    private async getAsyncData(sessionId: string) {
        const friendRequests = await this.facade.getFriendRequests(sessionId);
        const friendIds = await this.facade.getFriendIds(sessionId);
        const friends = await Promise.all(friendIds.map(async (id: string) => {
            return this.facade.getUser(id);
        }));
        let friendProfiles: { name: string, id: string }[] = [];
        for (const friend of friends) {
            friendProfiles.push({ name: friend.name, id: friend.id });
        }
        const sessionUser = await this.facade.getUser(sessionId);
        return { friendRequests, friends, friendProfiles, sessionUser }
    }


    private getFriendRequestSidebarOptionsProps(sessionId: string, friendRequests: string[]): FriendRequestSidebarOptionsProps {
        return {
            initialRequestCount: friendRequests?.length || 0,
            sessionId
        }
    }

    private sidebarChatlistProps(sessionId: string, sessionUser: User, friends: User[]): SidebarChatListProps {
        let chats: SidebarChatListItemProps[] = [];

        for (const friend of friends) {
            chats.push({
                participants: [sessionUser, friend],
                unseenMessages: 0,
                chatId: this.getChatId([sessionUser.id, friend.id]),
                sessionId
            });
        }
        return { chats, sessionId }
    }

    private getChatId(participantIds: string[]): string {
        return participantIds.sort().join('--');
    }
}
