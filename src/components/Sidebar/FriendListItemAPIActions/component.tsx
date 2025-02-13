import { FriendListItemAPIActionsProps } from "./interface";
import { FC } from "react";

const FriendListItemAPIActions: FC<FriendListItemAPIActionsProps> = () => {
    return (
        <div>
            <li>Chat</li>
            <li>Remove Friend</li>
        </div>
    )
}

export default FriendListItemAPIActions;
