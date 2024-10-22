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
    return <li key = {friend.id}>
        <a href = {`/dashboard/chat/${chatId}`}>
            {friend.name}
          <UnseenMessages messages={unseenMessages}/>
        </a>
    </li>
}

const UnseenMessages:FC<{messages: number}> = ({messages})=>{
    if(messages > 0){
        return <div>
            {messages}
        </div>
    }
    return null;
}

export default SidebarChatListItem;