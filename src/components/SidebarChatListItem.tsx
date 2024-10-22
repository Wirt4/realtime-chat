"use client";

import {FC} from "react";
import {Utils} from "@/lib/utils";

interface SidebarChatListItemProps {
    friend: User,
    unseenMessages: number
    sessionId: string
}
const SidebarChatListItem:FC<SidebarChatListItemProps> = ({friend, unseenMessages, sessionId})=>{
    const chatId = Utils.chatHrefConstructor(friend.id, sessionId);
    return <li key = {friend.id} className="group">
        <a href = {`/dashboard/chat/${chatId}`} className='sidebar-chat-list-item'>
            {friend.name}
          <UnseenMessages messages={unseenMessages}/>
        </a>
    </li>
}

const UnseenMessages:FC<{messages: number}> = ({messages})=>{
    if(messages > 0){
        return <div className='unread-messages-count'>
            {messages}
        </div>
    }
    return null;
}

export default SidebarChatListItem;
