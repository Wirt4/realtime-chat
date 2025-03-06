import { FC } from "react";
import FriendListItemProps from "./interface";
import { useState } from 'react';
import FriendListItemAPIActions from "../FriendListItemAPIActions/component";

const FriendListItem: FC<FriendListItemProps> = (props) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <li className='sidebar-chat-list-item'>
            <span onClick={() => setIsVisible(p => !p)} className='truncate'>{props.friend.name}</span>
            {isVisible && (<FriendListItemAPIActions friendId={props.friend.id} userId={props.sessionid} />)}
        </li>
    )
}

export default FriendListItem;
