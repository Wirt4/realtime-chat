"use client";

import React, {FC, useState} from "react";
import SidebarChatListItem from "@/components/SidebarChatListItem";
interface SidebarChatListProps {
    friends: User[],
    sessionId: string,
}

const SidebarChatList:FC<SidebarChatListProps> = ({friends, sessionId})=>{
    const [activeChats, setActiveChats] = useState<User[]>(friends);
    const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);

    return (<ul key={sessionId} aria-label='chat list'>
        {activeChats.sort((chatA: User, chatB: User)=>{
            return chatA.name < chatB.name ? -1 : 1
        }).map((friend: User)=>{
            const numberOfUnseenMessages = unseenMessages.filter(msg=> msg?.senderId === friend.id).length
            return <SidebarChatListItem
                key={friend.id}
                friend = {friend}
                unseenMessages={numberOfUnseenMessages}
                sessionId={sessionId}/>
        })}
    </ul>)
}

export default SidebarChatList;
