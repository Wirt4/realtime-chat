import { SidebarChatListProps } from "./ChatList/interface";
import { FriendRequestSidebarOptionsProps } from "./SidebarOptions/friendRequestSidebarOptions/interface";
import { FriendsListProps } from "./FriendsList/interface";

export interface SidebarProps {
    friends: User[];
    friendRequestSidebarOptions: FriendRequestSidebarOptionsProps;
    sidebarChatlist: SidebarChatListProps
    friendsListProps: FriendsListProps
}
