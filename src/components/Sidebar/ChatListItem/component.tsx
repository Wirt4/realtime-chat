"use client";

import { FC } from "react";
import { SidebarChatListItemProps } from "./interface";
import ChatImage from "@/components/Sidebar/ChatImage/component";
import { ChatName } from "@/lib/classes/chatName/implementation";
import ToggleHeader from "@/components/ui/toggleHeader/component";

const SidebarChatListItem: FC<SidebarChatListItemProps> = (props) => {
    const { participants, unseenMessages, chatId, sessionId } = props;
    const chatName = new ChatName(participants, sessionId);
    const iconSize = 32
    return <li key={chatId} className="group">
        <a href={`/dashboard/chat/${chatId}`} className='sidebar-chat-list-item'>
            <ChatImage
                size={iconSize}
                chatId={chatId}
                sessionId={sessionId}
                participantInfo={participants} />
            {chatName.getChatName()}
            <UnseenMessages messages={unseenMessages} />
        </a>
    </li>
}

const UnseenMessages: FC<{ messages: number }> = ({ messages }) => {
    return <ToggleHeader title={messages.toString()}
        exists={messages > 0}
        className='unread-messages-header' />
}

export default SidebarChatListItem;
