"use client";

import { FC, useState } from "react";
import { SidebarChatListItemProps } from "./interface";
import ChatImage from "@/components/Sidebar/ChatImage/component";
import { ChatName } from "@/lib/classes/chatName/implementation";
import ToggleHeader from "@/components/ui/toggleHeader/component";

const SidebarChatListItem: FC<SidebarChatListItemProps> = (props) => {

    const [isVisible, setIsVisible] = useState(false);

    const openPopup = () => setIsVisible(true);
    const closePopup = () => setIsVisible(false);

    const { participants, unseenMessages, chatId, sessionId } = props;
    const chatName = new ChatName(participants, sessionId);
    const iconSize = 32
    return <li key={chatId} className="group">
        <a href={`/dashboard/chat/${chatId}`} className='sidebar-chat-list-item'>
            <ChatImage
                size={iconSize}
                chatId={chatId}
                sessionId={sessionId}
                participantInfo={participants}
            />
            {chatName.getChatName()}
            <UnseenMessages messages={unseenMessages} />
        </a>
        < div onClick={!isVisible ? openPopup : closePopup} className="text-sm pl-4">options</div>
        {isVisible && (
            <li className='sidebar-chat-list-item'>
                <div className="flex flex-col">
                    <ul className="flex flex-col pl-4">
                        <li>Add Friend To Chat</li>
                    </ul>
                </div>
            </li>
        )}
    </li>
}

const UnseenMessages: FC<{ messages: number }> = ({ messages }) => {
    return <ToggleHeader title={messages.toString()}
        exists={messages > 0}
        className='unread-messages-header' />
}

export default SidebarChatListItem;
