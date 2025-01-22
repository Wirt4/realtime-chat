"use client";

import React, { FC, useEffect, useState } from "react";
import SidebarChatListItem from "@/components/SidebarChatListItem";
import { SidebarChatListProps } from "./interface";
import { Utils } from "@/lib/utils";


const SidebarChatList: FC<SidebarChatListProps> = (props) => {
    const { friends, sessionId, chatId } = props;
    const [activeChats, setActiveChats] = useState<User[]>(friends);
    const [unseenMessages] = useState<Message[]>([]);

    useEffect(() => {
        setActiveChats(friends);
    }, [friends]);

    return (<ul key={sessionId} aria-label='chat list' className='sidebar-chat-list'>
        {activeChats.sort(Utils.userSort).map((friend: User) => {
            const numberOfUnseenMessages = unseenMessages.filter(msg => msg?.senderId === friend.id).length
            return <SidebarChatListItem
                key={friend.id}
                friend={friend}
                unseenMessages={numberOfUnseenMessages}
                chatId={chatId} />
        })}
    </ul>)
}

export default SidebarChatList;
