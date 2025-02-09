import { SidebarProps } from "./interface";
import { FC } from "react";
import Link from "next/link";
import { Icons } from "@/components/Icons";
import SidebarChatList from "@/components/Sidebar/ChatList/component";
import AddFriendListItem from "@/components/Sidebar/AddFriendListItem/addFriendListItem";
import FriendRequestSidebarOptions from "./SidebarOptions/friendRequestSidebarOptions/FriendRequestSidebarOptions";
import SignOutButton from "../signOutButton";
import FriendsList from "./FriendsList/component";
import ToggleHeader from "../ui/toggleHeader/component";

const Sidebar: FC<SidebarProps> = (props) => {
    return (
        <div className='dashboard'>
            <Link href="/dashboard" className='dashboard-link'>
                <Icons.Logo className='dashboard-logo' />
            </Link>
            <nav className='dashboard-nav-cols'>
                <ul role='list' className='dashboard-ul'>
                    <ToggleHeader title='Your Chats' exists={props.hasActiveChats} className='dashboard-subheader' />
                    <SidebarChatList {...props.sidebarChatlistProps} aria-label='chat list' />
                    <ToggleHeader title='Your Friends' exists={props.hasFriends} className='dashboard-subheader' />
                    <FriendsList {...props.friendsListProps} aria-label='friend list' />
                    <div className='dashboard-subheader'>Overview</div>
                    <ul role='list' className='dashboard-sub-ul'>
                        <AddFriendListItem />
                        <FriendRequestSidebarOptions {...props.friendRequestSidebarOptionsProps} />
                    </ul>
                    <ul role='list' className='signout-ul'>
                        <SignOutButton /></ul>
                    <ul />
                </ul>
            </nav>
        </div>
    )
}

export default Sidebar;
