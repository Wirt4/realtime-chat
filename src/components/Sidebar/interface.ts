import { FriendRequestSidebarOptionsProps } from "./SidebarOptions/friendRequestSidebarOptions/interface";

export interface SidebarProps {
    friends: User[];
    sessionId: string;
    chatId: string;
    userId: string;
    friendRequests: string[];
    friendRequestSidebarOptions: FriendRequestSidebarOptionsProps;
}