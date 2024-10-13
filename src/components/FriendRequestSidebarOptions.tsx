'use client';
import {FC} from "react";
import Link from "next/link";
import {Icons} from "@/components/Icons";
const User = Icons['User']
const FriendRequestSidebarOptions: FC = ()=>{
    return <><Link href='/dashboard/requests'><div>
        <User aria-label='User'/>
    </div></Link></>;
}

export default FriendRequestSidebarOptions;
