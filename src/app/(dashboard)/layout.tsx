'use client'

import React, {ReactNode, useState, useEffect} from "react";
import {notFound} from "next/navigation";
import Link from "next/link";
import {Icons} from "@/components/Icons";
import NavbarListItem from "@/app/(dashboard)/navbarlistitem";
import layoutOptions from "@/app/(dashboard)/layoutOptions";
import FriendRequestSidebarOptions from "@/components/friendRequestSidebarOptions/FriendRequestSidebarOptions";
import fetchRedis from "@/helpers/redis";
import myGetServerSession from "@/lib/myGetServerSession";

interface LayoutProps {
    children: ReactNode
}

const Layout = ({children}: LayoutProps = {children:null})=>{
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [friendRequests, setFriendRequests] = useState<string[]>([]);

    useEffect(()=>{
        const fetchSession= async ()=>{
            const session =await myGetServerSession();

            if (!session){
                notFound();
                return;
            }

            setSession(session);
            const friendRequests = await fetchRedis("smembers", `user:${session?.user?.id}:incoming_friend_requests`);
            setFriendRequests(friendRequests);
            setLoading(false);
        }

        fetchSession();
    },[]);

    if (loading) return <div>Loading...</div>;
    if (!session) return null;

    return<div className='dashboard-window'>
        <div className='dashboard'>
        <Link href="/dashboard" className='dashboard-link'>
           <Icons.Logo className='dashboard-logo'/>
        </Link>
        <div className='dashboard-subheader'>
            Your Chats
        </div>
            <nav className='dashboard-nav-cols'>
                <ul role='list' className='dashboard-ul'>
                    <li>
                      To Be Determined: Chats that the user has
                    </li>
                    <div className='dashboard-subheader'>Overview</div>
                    <ul role='list' className='dashboard-sub-ul'>
                        {layoutOptions.map((option)=>{
                            return <NavbarListItem key = {option.id}
                                                   Icon = {option.Icon}
                                                   name = {option.name}
                                                   href = {option.href}
                            />
                        })}
                    </ul>
                    <li>
                        <FriendRequestSidebarOptions initialRequestCount={friendRequests.length} sessionId={session.user.id}/>
                    </li>
                </ul>
            </nav>
        </div>
        {children}
    </div>;
}

export default Layout;
