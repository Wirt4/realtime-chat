import { SidebarProps } from "./interface";
import { FC } from "react";
import Link from "next/link";
import { Icons } from "@/components/Icons";
import SidebarChatList from "@/components/Sidebar/ChatList/SidebarChatList";
import AddFriendListItem from "@/components/Sidebar/AddFriendListItem/addFriendListItem";
import FriendRequestSidebarOptions from "./SidebarOptions/friendRequestSidebarOptions/FriendRequestSidebarOptions";
import SignOutButton from "../signOutButton";


const Sidebar: FC<SidebarProps> = (props) => {

    const { friends } = props;
    return (<div className='dashboard'>
        <Link href="/dashboard" className='dashboard-link'>
            <Icons.Logo className='dashboard-logo' />
        </Link>
        {friends?.length && friends.length > 0 ? <div className='dashboard-subheader'>
            Your Chats
        </div> : null}
        <nav className='dashboard-nav-cols'>
            <ul role='list' className='dashboard-ul'>
                <SidebarChatList {...props.sidebarChatlist} aria-label='chat list' />
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
    </div>)
}

export default Sidebar;
