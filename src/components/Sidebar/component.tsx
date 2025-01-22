import { SidebarProps } from "./interface";
import { FC } from "react";
import Link from "next/link";
import { Icons } from "@/components/Icons";
import SidebarChatList from "@/components/Sidebar/ChatList/SidebarChatList";
import AddFriendListItem from "@/components/Sidebar/AddFriendListItem/addFriendListItem";
import FriendRequestSidebarOptions from "./SidebarOptions/friendRequestSidebarOptions/FriendRequestSidebarOptions";
import SignOutButton from "../signOutButton";
import FriendsList from "./FriendsList/component";

const Sidebar: FC<SidebarProps> = (props) => {
    return (
        <div className='dashboard'>
            <Link href="/dashboard" className='dashboard-link'>
                <Icons.Logo className='dashboard-logo' />
            </Link>
            <nav className='dashboard-nav-cols'>
                <ul role='list' className='dashboard-ul'>
                    <ToggleHeder title='Your Chats' exists={props.hasActiveChats} />
                    <SidebarChatList {...props.sidebarChatlistProps} aria-label='chat list' />
                    <ToggleHeder title='Your Friends' exists={props.hasFriends} />
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

const ToggleHeder: FC<{ title: string, exists: boolean }> = ({ title, exists }) => {
    if (!exists) return null;
    return <div className='dashboard-subheader'>
        {title}
    </div>
}

export default Sidebar;
