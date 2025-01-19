"use client";

import { FC } from "react";

interface SidebarChatListItemProps {
    friend: User,
    unseenMessages: number
    chatId: string
}

const SidebarChatListItem: FC<SidebarChatListItemProps> = ({ friend, unseenMessages, chatId }) => {
    return <li key={friend.id} className="group">
        <a href={`/dashboard/chat/${chatId}`} className='sidebar-chat-list-item'>
            {friend.name}
            <UnseenMessages messages={unseenMessages} />
        </a>
    </li>
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
