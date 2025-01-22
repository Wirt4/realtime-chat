import { Session } from "next-auth"
import { aDashboardData } from "./abstract";
import { SidebarProps } from "@/components/Sidebar/interface";
import { aSessionData } from "../session/abstract";
import { aUserRepository } from "@/repositories/user/abstract";
import { sessionDataFactory } from "../session/factory";
import { aFriendsRepository } from "@/repositories/friends/abstract";
import { SidebarChatListItemProps } from "@/components/Sidebar/ChatListItem/interface";
import { FriendRequestSidebarOptionsProps } from "@/components/Sidebar/SidebarOptions/friendRequestSidebarOptions/interface";
import { SidebarChatListProps } from "@/components/Sidebar/ChatList/interface";

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
        const asyncData = await this.getAsyncData(sessionId);

        const friendsListProps = { friends: asyncData.friends };
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
        const friendRequests = await this.friendRequestsRepository.get(sessionId);
        const friendIds = await this.friendsRepository.get(sessionId);
        const friends = await Promise.all(friendIds.map(async (id: string) => {
            return this.userRepository.getUser(id);
        }));
        const sessionUser = await this.userRepository.getUser(sessionId);
        return { friendRequests, friends, friendIds, sessionUser }
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
