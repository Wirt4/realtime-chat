'use client'

import {FC} from "react";
import {Icons} from "@/components/Icons";


const FriendRequests :FC =()=>{
    return <div aria-label='friend requests'>
        <p>Nothing to show here...</p>
        <Icons.AddUser aria-label='add user'/>
        <Icons.AddUser aria-label='add user'/>
    </div>;
}

export default FriendRequests;