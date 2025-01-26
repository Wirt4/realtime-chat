'use client';

import { FC, useState } from "react";
import { FriendsListProps } from "./interface";
import { X } from "lucide-react";
import Button from "@/components/ui/button/Button";

const FriendsList: FC<FriendsListProps> = (props) => {
    const { friends } = props;
    const [isVisible, setIsVisible] = useState(false);

    const openPopup = () => setIsVisible(true);
    const closePopup = () => setIsVisible(false);
    return (
        <ul className='sidebar-chat-list'>
            {friends?.sort((friendA: string, friendB: string) => {
                return friendA > friendB ? 1 : -1
            }).map((friend: string) => {
                return (<div><li className='sidebar-chat-list-item'>
                    <span className='truncate' onClick={!isVisible ? openPopup : closePopup}>{friend}</span>
                </li>
                    {isVisible && (
                        <li className='sidebar-chat-list-item'>
                            <div className="flex flex-col">
                                <ul className="flex flex-col pl-4">
                                    <li>Chat</li>
                                    <li>Remove friend</li>
                                </ul>
                            </div>
                        </li>
                    )}
                </div>)
            })}
        </ul>)
}
export default FriendsList;
