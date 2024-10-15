'use client'

import {FC} from "react";
import {Icons} from "@/components/Icons";

interface FriendRequestsProps {
    incomingFriendRequests: {
        senderId:string,
        senderEmail:string
    }[]
}
const FriendRequests :FC<FriendRequestsProps> =({incomingFriendRequests})=>{
    if (incomingFriendRequests.length==0) {
        return <p aria-label='friend requests'>Nothing to show here...</p>;
    }
    return <div aria-label='friend requests'>
        {incomingFriendRequests.map((request)=>{
            return <Icons.AddUser key={request.senderId} aria-label='add user'/>
        })}
    </div>;
}

export default FriendRequests;