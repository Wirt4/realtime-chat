import axios from "axios";
import { FriendListItemAPIActionsProps } from "./interface";
import { FC } from "react";

const FriendListItemAPIActions: FC<FriendListItemAPIActionsProps> = () => {
    return (
        <div>
            <li>Chat</li>
            <li onClick={() => axios.post('/api/friends/remove', { idToRemove: "test-friend-id" })}>Remove Friend</li>
        </div>
    )
}

export default FriendListItemAPIActions;
