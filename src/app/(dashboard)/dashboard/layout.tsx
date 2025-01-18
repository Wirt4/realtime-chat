import React, { ReactNode } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Icons } from "@/components/Icons";
import AddFriendListItem from "@/app/(dashboard)/dashboard/addFriendListItem";
import FriendRequestSidebarOptions from "@/components/friendRequestSidebarOptions/FriendRequestSidebarOptions";
import SignOutButton from "@/components/signOutButton";
import SidebarChatList from "@/components/SidebarChatList";
import { iDashboardData } from "@/services/dashboard/interface";
import { dashboardDataFactory } from "@/services/dashboard/factory";

interface LayoutProps {
    children: ReactNode
}

const Layout = async ({ children }: LayoutProps = { children: null }) => {
    const dashboardData: iDashboardData = dashboardDataFactory();
    try {
        const session = await dashboardData.getSession();
        const userId = session?.user?.id
        const friendRequests = await dashboardData.getIncomingFriendRequests(userId);
        const friendRequestProps = requestProps(friendRequests, userId);
        const friends = await dashboardData.getFriendsById(userId);

        return <div className='dashboard-window'>
            <div className='dashboard'>
                <Link href="/dashboard" className='dashboard-link'>
                    <Icons.Logo className='dashboard-logo' />
                </Link>
                {friends?.length && friends.length > 0 ? <div className='dashboard-subheader'>
                    Your Chats
                </div> : null}
                <nav className='dashboard-nav-cols'>
                    <ul role='list' className='dashboard-ul'>
                        <SidebarChatList friends={friends} aria-label='chat list' sessionId={userId} />
                        <div className='dashboard-subheader'>Overview</div>
                        <ul role='list' className='dashboard-sub-ul'>
                            <AddFriendListItem />
                            <FriendRequestSidebarOptions {...friendRequestProps} />
                        </ul>
                        <ul role='list' className='signout-ul'>
                            <SignOutButton />
                        </ul>
                        <ul />
                    </ul>
                </nav>
            </div>
            {children}
        </div>;
    } catch {
        notFound();
    }
}

function requestProps(friendRequests: string[], userId: string) {
    return {
        initialRequestCount: friendRequests?.length || 0,
        sessionId: userId
    }
}


export default Layout;
