import { FC } from "react";
import FriendListItemProps from "./interface";

const FriendListItem: FC<FriendListItemProps> = ({ friend }) => {
    return (
        <li className='sidebar-chat-list-item'>
            <span className='truncate'>{friend.name}</span>
        </li>
    )
}

export default FriendListItem;
