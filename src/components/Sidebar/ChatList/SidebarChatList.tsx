"use client";

import React, { FC, useEffect, useState } from "react";
import SidebarChatListItem from "@/components/Sidebar/ChatListItem/SidebarChatListItem";
import { SidebarChatListProps } from "./interface";
import { SidebarChatListItemProps } from "../ChatListItem/interface";


const SidebarChatList: FC<SidebarChatListProps> = (props) => {
    const { sessionId, chats } = props;
    const [activeChats, setActiveChats] = useState<SidebarChatListItemProps[]>(chats);
    const [unseenMessages] = useState<Message[]>([]);

    useEffect(() => {
        setActiveChats(chats);
    }, [chats]);

    return (<ul key={sessionId} aria-label='chat list' className='sidebar-chat-list'>
        {activeChats.sort((chatA: SidebarChatListItemProps, chatB: SidebarChatListItemProps) => {
            return chatA.chatId > chatB.chatId ? 1 : -1
        }).map((chat: SidebarChatListItemProps) => {
            const numberOfUnseenMessages = unseenMessages.filter(msg => msg?.senderId !== sessionId).length
            return <SidebarChatListItem
                sessionId={sessionId}
                key={chat.chatId}
                chatId={chat.chatId}
                participants={chat.participants}
                unseenMessages={numberOfUnseenMessages}
            />
        })}
    </ul>)
}

export default SidebarChatList;
