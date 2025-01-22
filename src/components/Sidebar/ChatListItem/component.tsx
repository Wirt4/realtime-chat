"use client";

import { FC } from "react";
import { SidebarChatListItemProps } from "./interface";
import Image from "next/image";
import { ChatName } from "@/lib/classes/chatName/implementation";

const SidebarChatListItem: FC<SidebarChatListItemProps> = (props) => {
    const { participants, unseenMessages, chatId, sessionId } = props;
    const chatName = new ChatName(participants, sessionId);
    return <li key={chatId} className="group">
        <a href={`/dashboard/chat/${chatId}`} className='sidebar-chat-list-item'>
            <ChatImage {...props} />
            {chatName.getChatName()}
            <UnseenMessages messages={unseenMessages} />
        </a>
    </li>
}

const ChatImage: FC<SidebarChatListItemProps> = (props) => {
    const { participants, chatId, sessionId } = props;
    const imgaeSize = 32;
    let src: string;

    if (participants[0].id === sessionId) {
        src = participants[1].image
    } else {
        src = participants[0].image
    }

    return (<Image src={src}
        alt={chatId}
        referrerPolicy='no-referrer'
        width={imgaeSize}
        height={imgaeSize}
        className='rounded-full'
    />)
}



const UnseenMessages: FC<{ messages: number }> = ({ messages }) => {
    if (messages > 0) {
        return <div className='unread-messages-count'>
            {messages}
        </div>
    }
    return null;
}

export default SidebarChatListItem;
