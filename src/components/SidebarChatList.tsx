"use client";

import React, {FC, useState} from "react";
import SidebarChatListItem from "@/components/SidebarChatListItem";
interface SidebarChatListProps {
    friends: User[]
}
const SidebarChatList:FC<SidebarChatListProps> = ({friends})=>{
    const [activeChats, setActiveChats] = useState<User[]>(friends)
    const [unseenMessages, setUnseenMessages] = useState<Message[]>([])
    return (<ul aria-label='chat list'>
        {activeChats.sort((chatA: User, chatB: User)=>{
            return chatA.name < chatB.name ? -1 : 1
        }).map(friend=>{
            const numberOfUnseenMessages = unseenMessages.filter(msg=> msg?.senderId === friend.id).length
            return <SidebarChatListItem
                key={friend.id}
                friend = {friend}
                unseenMessages={numberOfUnseenMessages} />
        })}
    </ul>)
}

export default SidebarChatList;
