'use client';
import {FC, useState, useEffect} from "react";
import Link from "next/link";
import {Icons} from "@/components/Icons";
import FriendRequestEffect from "@/components/friendRequestSidebarOptions/FriendRequestEffect";
const User = Icons['User']

interface FRSOProps{
    initialRequestCount: number
    sessionId: string
}

const FriendRequestSidebarOptions: FC<FRSOProps> = ({initialRequestCount, sessionId})=>{
    const [requestCount] = useState<number>(initialRequestCount);
    useEffect(FriendRequestEffect, [sessionId]);

    return <>
        <Link href='/dashboard/requests' className='dashboard-icon'>
        <div className='dashboard-div'>
            <User aria-label="User" className='icon'/>
            </div>
            <p>Friend Requests</p>
            { requestCount > 0 ? <div>{requestCount}</div> : null }
    </Link>
    </>;
}

export default FriendRequestSidebarOptions;
