import { SidebarChatListProps } from "./ChatList/interface";
import { FriendRequestSidebarOptionsProps } from "./SidebarOptions/friendRequestSidebarOptions/interface";
import { FriendsListProps } from "./FriendsList/interface";

export interface SidebarProps {
    friendRequestSidebarOptionsProps: FriendRequestSidebarOptionsProps;
    sidebarChatlistProps: SidebarChatListProps
    friendsListProps: FriendsListProps
    hasFriends: boolean
    hasActiveChats: boolean
}
