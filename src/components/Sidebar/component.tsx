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

    const { hasActiveChats, hasFriends } = props;
    return (
        <div className='dashboard'>
            <Link href="/dashboard" className='dashboard-link'>
                <Icons.Logo className='dashboard-logo' />
            </Link>
            <nav className='dashboard-nav-cols'>
                <ul role='list' className='dashboard-ul'>
                    {hasActiveChats ? <div className='dashboard-subheader'>
                        Your Chats
                    </div> : null}
                    <SidebarChatList {...props.sidebarChatlist} aria-label='chat list' />
                    {hasFriends ? <div className='dashboard-subheader'>
                        Your Friends
                    </div> : null}
                    <FriendsList {...props.friendsListProps} aria-label='friend list' />
                    <div className='dashboard-subheader'>Overview</div>
                    <ul role='list' className='dashboard-sub-ul'>
                        <AddFriendListItem />
                        <FriendRequestSidebarOptions {...props.friendRequestSidebarOptions} />
                    </ul>
                    <ul role='list' className='signout-ul'>
                        <SignOutButton />
                    </ul>
                    <ul />
                </ul>
            </nav>
        </div>
    )
}

export default Sidebar;
