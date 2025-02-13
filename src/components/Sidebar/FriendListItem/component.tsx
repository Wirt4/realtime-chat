import { FC } from "react";
import FriendListItemProps from "./interface";
import { useState } from 'react';
import FriendListItemAPIActions from "../FriendListItemAPIActions/component";

const FriendListItem: FC<FriendListItemProps> = ({ friend }) => {
    const [isVisible, setIsVisible] = useState(false);
    return (
        <li className='sidebar-chat-list-item'>
            <span onClick={() => setIsVisible(true)} className='truncate'>{friend.name}</span>
            {isVisible && (<FriendListItemAPIActions id={friend.id} />)}
        </li>
    )
}

export default FriendListItem;
