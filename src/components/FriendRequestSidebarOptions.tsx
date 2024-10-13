'use client';
import {FC} from "react";
import Link from "next/link";
import {Icons} from "@/components/Icons";
const User = Icons['User']

interface FriendRequestSidebarOptionsProps{
    initialUnseenRequestCount: number
}

const FriendRequestSidebarOptions: FC<FriendRequestSidebarOptionsProps> = ({
                                                                               initialUnseenRequestCount
                                                                           })=>{
    return <>
        <Link href='/dashboard/requests'>
        <div>
            <User aria-label="User"/>
            <p>Friend Requests</p>
            <div>{initialUnseenRequestCount}</div>
        </div>
    </Link>
    </>;
}

export default FriendRequestSidebarOptions;
