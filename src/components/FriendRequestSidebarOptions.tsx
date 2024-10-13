'use client';
import {FC} from "react";
import Link from "next/link";
import {Icons} from "@/components/Icons";
const User = Icons['User']

interface FRSOProps{
    initialRequestCount: number
}

const FriendRequestSidebarOptions: FC<FRSOProps> = ({initialRequestCount})=>{
    return <>
        <Link href='/dashboard/requests'>
        <div>
            <User aria-label="User"/>
            <p>Friend Requests</p>
            { initialRequestCount >0 ? <div>{initialRequestCount}</div> : null }
        </div>
    </Link>
    </>;
}

export default FriendRequestSidebarOptions;
