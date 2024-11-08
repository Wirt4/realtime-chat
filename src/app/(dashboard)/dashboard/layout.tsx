import React, {ReactNode} from "react";
import {notFound} from "next/navigation";
import Link from "next/link";
import {Icons} from "@/components/Icons";
import AddFriendListItem from "@/app/(dashboard)/dashboard/addFriendListItem";
import FriendRequestSidebarOptions from "@/components/friendRequestSidebarOptions/FriendRequestSidebarOptions";
import fetchRedis from "@/helpers/redis";
import myGetServerSession from "@/lib/myGetServerSession";
import SignOutButton from "@/components/signOutButton";
import getFriendsById from "@/helpers/getFriendsById";
import SidebarChatList from "@/components/SidebarChatList";
import QueryBuilder from "@/lib/queryBuilder";

interface LayoutProps {
    children: ReactNode
}

const Layout = async ({children}: LayoutProps = {children:null})=>{
    const session = await myGetServerSession();

    if (!session){
        notFound();
    }

    const userId = session?.user?.id
    const friendRequests = await fetchRedis("smembers", QueryBuilder.incomingFriendRequests(userId));
    const friendRequestProps = {
        initialRequestCount: friendRequests.length,
        sessionId: userId
    }

    const friends = await getFriendsById(userId);

    return<div className='dashboard-window'>
        <div className='dashboard'>
        <Link href="/dashboard" className='dashboard-link'>
           <Icons.Logo className='dashboard-logo'/>
        </Link>
            {friends.length > 0 ? <div className='dashboard-subheader'>
            Your Chats
        </div>: null}
            <nav className='dashboard-nav-cols'>
                <ul role='list' className='dashboard-ul'>
                    <SidebarChatList friends={friends} aria-label='chat list' sessionId={userId}/>
                    <div className='dashboard-subheader'>Overview</div>
                        <ul role='list' className='dashboard-sub-ul'>
                            <AddFriendListItem/>
                            <FriendRequestSidebarOptions {...friendRequestProps}/>
                        </ul>
                    <ul role='list' className='signout-ul'>
                        <SignOutButton/>
                    </ul>
                    <ul/>
                </ul>
            </nav>
        </div>
        {children}
    </div>;
}

export default Layout;
