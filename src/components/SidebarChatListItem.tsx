"use client";

import { FC } from "react";

interface SidebarChatListItemProps {
    friend: User,
    unseenMessages: number
    chatId: string
}

const SidebarChatListItem: FC<SidebarChatListItemProps> = (props) => {
    const { friend, unseenMessages, chatId } = props;
    const { id, name } = friend
    return <li key={id} className="group">
        <a href={`/dashboard/chat/${chatId}`} className='sidebar-chat-list-item'>
            {name}
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
