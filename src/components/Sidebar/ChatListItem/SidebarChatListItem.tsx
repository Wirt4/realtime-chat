"use client";

import { FC } from "react";
import { SidebarChatListItemProps } from "./interface";
import Image from "next/image";


const SidebarChatListItem: FC<SidebarChatListItemProps> = (props) => {
    const imgaeSize = 32;
    const { participants, unseenMessages, chatId, sessionId } = props;
    return <li key={chatId} className="group">
        <a href={`/dashboard/chat/${chatId}`} className='sidebar-chat-list-item'>
            <ChatImage {...props} />
            {`Chat with ${participantName(participants, sessionId)}`}
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
