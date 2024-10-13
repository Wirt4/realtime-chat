'use client';
import {FC, useState, useEffect} from "react";
import Link from "next/link";
import {Icons} from "@/components/Icons";
import FriendRequestEffect from "@/components/friendRequestSidebarOptions/FriendRequestEffect";
const User = Icons['User']

interface FRSOProps{
    initialRequestCount: number
}

const FriendRequestSidebarOptions: FC<FRSOProps> = ({initialRequestCount})=>{
    const [requestCount] = useState<number>(initialRequestCount);
    useEffect(FriendRequestEffect);

    return <>
        <Link href='/dashboard/requests'>
        <div>
            <User aria-label="User"/>
            <p>Friend Requests</p>
            { requestCount > 0 ? <div>{requestCount}</div> : null }
        </div>
    </Link>
    </>;
}

export default FriendRequestSidebarOptions;
