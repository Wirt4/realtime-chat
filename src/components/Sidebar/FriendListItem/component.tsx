import { FC, useState } from "react";
import FriendListItemProps from "./interface";
import axios from "axios";

const FriendListItem: FC<FriendListItemProps> = ({ name, id }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [popupIsVisible, setPopupIsVisible] = useState(false);

    const removeFriend = async () => {
        setIsVisible(false);
        await axios.post('/api/friends/remove', { idToRemove: id });
    }

    return (
        <li className='sidebar-chat-list-item'>

            {isVisible && (<span onClick={() => setPopupIsVisible(!popupIsVisible)} className='truncate'>{name}</span>)}
            {popupIsVisible && isVisible && (<li className='sidebar-chat-list-item'>
                <div className="flex flex-col">
                    <ul className="flex flex-col pl-4">
                        <li className='sidebar-chat-list-item'>Chat</li>
                        <li onClick={removeFriend} className='sidebar-chat-list-item'>Remove Friend</li>
                    </ul>
                </div>
            </li>)}
        </li>
    )
}

export default FriendListItem;
