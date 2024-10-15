'use client'

import {FC} from "react";
import {Icons} from "@/components/Icons";
import {Check} from 'lucide-react';

interface FriendRequestsProps {
    incomingFriendRequests: {
        senderId:string,
        senderEmail:string
    }[]
}
const FriendRequests :FC<FriendRequestsProps> =({incomingFriendRequests})=>{
    return <div aria-label='friend requests'>
        {incomingFriendRequests.length == 0 ?
        <p>Nothing to show here...</p>:
            incomingFriendRequests.map((request)=>{
                return (<>
                    <Icons.AddUser key={request.senderId} aria-label='add user'/>
                    <p>{request.senderEmail}</p>
                    <button aria-label='accept friend'>
                        <Check aria-label='checkmark'/>
                    </button>
                    <button aria-label='deny friend'>
                        <Check aria-label='checkmark'/>
                    </button>
                </>)
            })
        }</div>
}

export default FriendRequests;