import axios from "axios";
import { FriendListItemAPIActionsProps } from "./interface";
import { FC, useState } from "react";
import Link from "next/link";

const FriendListItemAPIActions: FC<FriendListItemAPIActionsProps> = ({ friendId: id }) => {
    const [visible, setVisible] = useState(true);
    const removeFriend = async () => {
        try {
            await Promise.all([
                axios.post('/api/friends/remove', { idToRemove: id }),
                axios.post('/api/message/remove/all', { idToRemove: id }),
                axios.get(`/api/chatprofile/id`, { participants: [id] })
            ]);
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
