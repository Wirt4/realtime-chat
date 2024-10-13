'use client';
import {FC} from "react";
import Link from "next/link";
import {Icons} from "@/components/Icons";
const User = Icons['User']

interface FRSOProps{
    requestCount: number
}

const FriendRequestSidebarOptions: FC<FRSOProps> = ({requestCount})=>{
    return <>
        <Link href='/dashboard/requests'>
        <div>
            <User aria-label="User"/>
            <p>Friend Requests</p>
            { requestCount !=0 ? <div>{requestCount}</div> : null }
        </div>
    </Link>
    </>;
}

export default FriendRequestSidebarOptions;
