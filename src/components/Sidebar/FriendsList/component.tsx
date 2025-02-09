'use client';

import { FC, useState } from "react";
import { FriendsListProps } from "./interface";
import axios from "axios";

const FriendsList: FC<FriendsListProps> = ({ friends = [] }) => {
    console.log("friends:")
    console.log(friends);
    const [isVisible, setIsVisible] = useState(false);
    const openPopup = () => setIsVisible(true);
    const closePopup = () => setIsVisible(false);
    const apiPost = async (senderId: string) => {
        console.log("clicked")
        await axios.post('/api/friends/remove', { idToRemove: senderId });
    }

    const sortedFriends = friends.sort((friendA, friendB) => friendA.name?.localeCompare(friendB.name));
    return (
        <ul className='sidebar-chat-list'>
            {sortedFriends.map((friend) => {
                return (<div key={friend.id}><li className='sidebar-chat-list-item'>
                    <span className='truncate' onClick={!isVisible ? openPopup : closePopup}>{friend.name}</span>
                </li>
                    {isVisible && (
                        <li className='sidebar-chat-list-item'>
                            <div className="flex flex-col">
                                <ul className="flex flex-col pl-4">
                                    <li className='sidebar-chat-list-item'>Chat</li>
                                    <li className='sidebar-chat-list-item' onClick={() => apiPost(friend.id)}>Remove Friend</li>
                                </ul>
                            </div>
                        </li>
                    )}
                </div>)
            })}
        </ul>)
}
export default FriendsList;
