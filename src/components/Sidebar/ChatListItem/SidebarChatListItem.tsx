"use client";

import { FC } from "react";
import { SidebarChatListItemProps } from "./interface";

const SidebarChatListItem: FC<SidebarChatListItemProps> = (props) => {
    const { participants, unseenMessages, chatId, sessionId } = props;
    return <li key={chatId} className="group">
        <a href={`/dashboard/chat/${chatId}`} className='sidebar-chat-list-item'>
            {`Chat with ${participantName(participants, sessionId)}`}
            <UnseenMessages messages={unseenMessages} />
        </a>
    </li>
}

function participantName(participants: User[], sessionId: string): string {
    let names: string[] = [];

    for (let i = 0; i < participants.length; i++) {
        if (participants[i].id !== sessionId) {
            names.push(participants[i].name);
        }
    }
    return names.join(' ');
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
