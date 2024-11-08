'use client';
import {FC, useState} from "react";
import Link from "next/link";
import {Icons} from "@/components/Icons";
const User = Icons['User']

interface FRSOProps{
    initialRequestCount: number
    sessionId: string
}

const FriendRequestSidebarOptions: FC<FRSOProps> = ({initialRequestCount, sessionId})=>{
    const [requestCount] = useState<number>(initialRequestCount);

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
