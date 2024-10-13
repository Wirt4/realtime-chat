'use client';
import {FC, useState} from "react";
import Link from "next/link";
import {Icons} from "@/components/Icons";
const User = Icons['User']

interface FRSOProps{
    initialRequestCount: number
}

const FriendRequestSidebarOptions: FC<FRSOProps> = ({initialRequestCount})=>{
    const [unseenRequestCount, setUnseenRequestCount] = useState<number>(
        initialRequestCount
    )
    return <>
        <Link href='/dashboard/requests'>
        <div>
            <User aria-label="User"/>
            <p>Friend Requests</p>
            { unseenRequestCount > 0 ? <div>{unseenRequestCount}</div> : null }
        </div>
    </Link>
    </>;
}

export default FriendRequestSidebarOptions;
