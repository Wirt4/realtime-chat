'use client';

import { FC, useState } from "react";
import { FriendsListProps } from "./interface";
import axios from "axios";
import Link from "next/link";

const FriendsList: FC<FriendsListProps> = ({ friends = [] }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [friendIsVisible, setFriendIsVisible] = useState(true);
    const openPopup = () => setIsVisible(true);
    const closePopup = () => setIsVisible(false);

    const apiPost = async (senderId: string) => {
        await axios.post('/api/friends/remove', { idToRemove: senderId });
        setFriendIsVisible(false);
    }

    const sortedFriends = friends.sort((friendA, friendB) => friendA.name?.localeCompare(friendB.name));
    return (
        <ul className='sidebar-chat-list'>
            {sortedFriends.map((friend) => {
                return (
                    <div key={friend.id}>{friendIsVisible && (<li className='sidebar-chat-list-item'>
                        <span className='truncate' onClick={!isVisible ? openPopup : closePopup}>{friend.name}</span>
                    </li>)}
                        {friendIsVisible && isVisible && (
                            <li className='sidebar-chat-list-item'>
                                <div className="flex flex-col">
                                    <ul className="flex flex-col pl-4">
                                        <li className='sidebar-chat-list-item'>Chat</li>
                                        <li className='sidebar-chat-list-item' onClick={() => apiPost(friend.id)}><Link href="/dashboard">Remove Friend</Link></li>
                                    </ul>
                                </div>
                            </li>
                        )}
                    </div>)
            })}
        </ul>)
}
export default FriendsList;
