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
        {incomingFriendRequests.length == 0 ?
        <p>Nothing to show here...</p>:
            incomingFriendRequests.map((request)=>{
                return (<>
                    <Icons.AddUser key={request.senderId} aria-label='add user'/>
                    <p>{request.senderEmail}</p>
                    <button aria-label='accept friend'></button>
                </>)
            })
        }</div>
}

export default FriendRequests;