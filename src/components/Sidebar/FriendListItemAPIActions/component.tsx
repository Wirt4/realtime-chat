import axios from "axios";
import { FriendListItemAPIActionsProps } from "./interface";
import { FC, useState } from "react";

const FriendListItemAPIActions: FC<FriendListItemAPIActionsProps> = ({ id }) => {
    const [visible, setVisible] = useState(true);
    const removeFriend = async () => {
        await axios.post('/api/friends/remove', { idToRemove: id });
        setVisible(false);
    }
    return (
        <>
            {visible && (
                <div>
                    <li>Chat</li>
                    <li onClick={removeFriend}>
                        Remove Friend
                    </li>
                </div>
            )}
        </>
    )
}

export default FriendListItemAPIActions;
