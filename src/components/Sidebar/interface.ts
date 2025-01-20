import { SidebarChatListProps } from "./ChatList/interface";
import { FriendRequestSidebarOptionsProps } from "./SidebarOptions/friendRequestSidebarOptions/interface";

export interface SidebarProps {
    friends: User[];
    friendRequestSidebarOptions: FriendRequestSidebarOptionsProps;
    sidebarChatlist: SidebarChatListProps
}
