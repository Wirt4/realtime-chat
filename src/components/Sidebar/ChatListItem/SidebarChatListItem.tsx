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

const participantName = (participants: User[], sessionId: string) => {
    const names = friendNames(participants, sessionId);

    if (names.length === 1) {
        return names[0];
    }

    if (names.length === 2) {
        return names.join(' and ');
    }

    const lastIndex = names.length - 1;
    names[lastIndex] = `and ${names[lastIndex]}`;
    return names.join(', ');
}

const friendNames = (participants: User[], sessionId: string) => {
    let names: string[] = [];

    for (let i = 0; i < participants.length; i++) {
        if (participants[i].id !== sessionId) {
            names.push(participants[i].name);
        }
    }

    return names;
};

const UnseenMessages: FC<{ messages: number }> = ({ messages }) => {
    if (messages > 0) {
        return <div className='unread-messages-count'>
            {messages}
        </div>
    }
    return null;
}

export default SidebarChatListItem;
