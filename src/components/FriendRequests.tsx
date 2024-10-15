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
    return <div aria-label='friend requests'>
        <p>Nothing to show here...</p>
        {incomingFriendRequests.map((request)=>{
            return <Icons.AddUser key={request.senderId} aria-label='add user'/>
        })}
    </div>;
}

export default FriendRequests;