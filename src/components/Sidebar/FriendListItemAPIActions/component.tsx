import axios from "axios";
import { FriendListItemAPIActionsProps } from "./interface";
import { FC, useState } from "react";
import Link from "next/link";

const FriendListItemAPIActions: FC<FriendListItemAPIActionsProps> = ({ friendId, userId }) => {
    const [visible, setVisible] = useState(true);
    const removeFriend = async () => {
        try {
            const res = await axios.post(`/api/chatprofile/getid`, { participants: [friendId, userId] })
            const chatId = res.data.chatId;
            if (chatId !== '') {
                await axios.post('/api/message/remove/all', { chatId });
            }
            await axios.post('/api/friends/remove', { idToRemove: friendId })
            setVisible(false);
        } catch (err) {
            console.error(err);
        }
    }
    return (
        <>
            {visible && (
                <div className="flex flex-col pl-4">
                    <li className="sidebar-chat-list-item">Chat</li>
                    <li className="sidebar-chat-list-item" onClick={removeFriend}>
                        <Link href="/dashboard">Remove Friend</Link>
                    </li>
                </div>
            )}
        </>
    )
}

export default FriendListItemAPIActions;
