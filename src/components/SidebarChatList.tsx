"use client";

import React, { FC, useEffect, useState } from "react";
import SidebarChatListItem from "@/components/SidebarChatListItem";
interface SidebarChatListProps {
    friends: User[],
    sessionId: string,
    chatId: string
}

const SidebarChatList: FC<SidebarChatListProps> = ({ friends, sessionId, chatId }) => {
    const [activeChats, setActiveChats] = useState<User[]>(friends);
    const [unseenMessages] = useState<Message[]>([]);

    useEffect(() => {
        setActiveChats(friends);
    }, [friends]);

    return (<ul key={sessionId} aria-label='chat list' className='sidebar-chat-list'>
        {activeChats.sort((chatA: User, chatB: User) => {
            return chatA.name < chatB.name ? -1 : 1
        }).map((friend: User) => {
            const numberOfUnseenMessages = unseenMessages.filter(msg => msg?.senderId === friend.id).length
            return <SidebarChatListItem
                key={friend.id}
                friend={friend}
                unseenMessages={numberOfUnseenMessages}
                sessionId={sessionId}
                chatId={chatId} />
        })}
    </ul>)
}

export default SidebarChatList;
