'use client'

import {FC} from "react";
import {Icons} from "@/components/Icons";

interface FriendRequestsProps {
    incomingFriendRequests: string[]
}
const FriendRequests :FC<FriendRequestsProps> =({incomingFriendRequests})=>{
    return <div aria-label='friend requests'>
        <p>Nothing to show here...</p>
        <Icons.AddUser aria-label='add user'/>
        <Icons.AddUser aria-label='add user'/>
    </div>;
}

export default FriendRequests;