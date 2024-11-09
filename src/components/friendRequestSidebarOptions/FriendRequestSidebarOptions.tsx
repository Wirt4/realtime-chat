'use client';
import {FC, useEffect, useState} from "react";
import Link from "next/link";
import {Icons} from "@/components/Icons";
import PusherClientHandler from "@/components/friendRequestSidebarOptions/helpers"
const User = Icons['User']

interface FRSOProps{
    initialRequestCount: number
    sessionId: string
}

const FriendRequestSidebarOptions: FC<FRSOProps> = ({initialRequestCount, sessionId})=>{
    const [requestCount, setRequestCount] = useState<number>(initialRequestCount);

    useEffect(()=> {
        const client = new PusherClientHandler(sessionId, requestCount)
        client.subscribeToPusher(setRequestCount)
    }, [sessionId, requestCount]);

    return <li>
        <Link href='/dashboard/requests' className='link'>
        <div className='link-icon group-hover:border-black group-hover:black flex'>
            <User aria-label="User" className='icon'/>
            </div>
            Friend Requests
            { requestCount > 0 ? <div className="unread-friend-requests-count">{requestCount}</div> : null }
    </Link>
    </li>;
}

export default FriendRequestSidebarOptions;
