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
        <Link href='/dashboard/requests' className='-mx-2 text-gray-700 hover:text-black hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'>
        <div className='text-gray-400 border-gray-200 oup-hover:border-black group-hover:text-black flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'>
            <User aria-label="User" className='h-4 w-4'/>
            </div>
            <p>Friend Requests</p>
            { requestCount > 0 ? <div>{requestCount}</div> : null }
    </Link>
    </>;
}

export default FriendRequestSidebarOptions;
