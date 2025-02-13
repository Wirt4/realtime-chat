import axios from "axios";
import { FriendListItemAPIActionsProps } from "./interface";
import { FC, useState } from "react";

const FriendListItemAPIActions: FC<FriendListItemAPIActionsProps> = ({ id }) => {
    const [visible, setVisible] = useState(true);
    const removeFriend = async () => {
        try {
            await axios.post('/api/friends/remove', { idToRemove: id });
            setVisible(false);
        } catch (err) {
            console.error(err);
            setVisible(true);
        }
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
