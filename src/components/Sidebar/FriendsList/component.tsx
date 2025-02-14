'use client';
import { FC } from 'react';
import { FriendsListProps } from './interface';
import FriendListItem from '../FriendListItem/component';

const FriendsList: FC<FriendsListProps> = ({ friends = [] }) => {

    return <ul className='sidebar-chat-list'>
        {friends.map((friend) => (
            <FriendListItem key={friend.id} friend={friend} />
        ))}
    </ul>
}
export default FriendsList;
