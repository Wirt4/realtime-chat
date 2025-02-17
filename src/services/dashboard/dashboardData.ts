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

        const friendsListProps = { friends: asyncData.friendProfiles, sessionid: sessionId };
        const hasFriends = asyncData.friends.length > 0;
        const hasActiveChats = asyncData.friends.length > 0;
        const friendRequestSidebarOptionsProps = this.getFriendRequestSidebarOptionsProps(sessionId, asyncData.friendRequests);
        const sidebarChatlistProps = { chats: asyncData.chatProfiles, sessionId };

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
        const activeChats = await this.facade.getUsersChats(sessionId);
        const chatProfiles: { sessionId: string, chatId: string, participants: User[], unseenMessages: number }[] = [];
        for (let i = 0; i < activeChats.length; i++) {
            const chatId = activeChats[i];
            const profile = await this.facade.getChatProfile(chatId);
            const members = Array.from(profile.members);
            const participants: User[] = [];
            for (let j = 0; j < members.length; j++) {
                const user = await this.facade.getUser(members[j]);
                if (!user) {
                    continue;
                }
                participants.push(user);
            }
            chatProfiles.push({ sessionId, chatId: profile.id, participants, unseenMessages: 0 });
        }

        const friendProfiles: { name: string, id: string }[] = [];
        for (const friend of friends) {
            friendProfiles.push({ name: friend.name, id: friend.id });
        }
        const sessionUser = await this.facade.getUser(sessionId);
        return { friendRequests, friends, friendProfiles, sessionUser, chatProfiles }
    }


    private getFriendRequestSidebarOptionsProps(sessionId: string, friendRequests: string[]): FriendRequestSidebarOptionsProps {
        return {
            initialRequestCount: friendRequests?.length || 0,
            sessionId
        }
    }

    /**
     * sidebarChatlistProps new outline
     * parameter is string, sessionId
     * 
     * 1 look up the active chats for the sessionId
     * 2. If the array of active chats is non empty, go to step 4
     * 3. Return an object containing the sessionId and an empty array of chatProfiles
     * 4. let L be set to the size of the active chats
     * 5. Initialize an array of chatProfiles set to size L
     * 6. set index to 0
     * 7. if index is greater than or equal to L, go to step 11
     * 8. look up the chat profile for the active chat at index
     * 9. set the chatProfiles at index to the chat profile
     * 10. increment index by 1
     * 11. return an object containing the sessionId and the array of chatProfiles
     */

    private sidebarChatlistProps(sessionId: string, sessionUser: User, friends: User[]): SidebarChatListProps {
        const chats: SidebarChatListItemProps[] = [];

        for (const friend of friends) {
            chats.push({
                participants: [sessionUser, friend],
                unseenMessages: 0,
                chatId: this.getChatId([sessionUser.id, friend.id]), // may be causing issues here
                sessionId
            });
        }
        return { chats, sessionId }
    }

    private getChatId(participantIds: string[]): string {
        return participantIds.sort().join('--');
    }
}
