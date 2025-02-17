'use client';
import { FC } from 'react';
import { FriendsListProps } from './interface';
import FriendListItem from '../FriendListItem/component';

const FriendsList: FC<FriendsListProps> = (props) => {

    return <ul className='sidebar-chat-list'>
        {props.friends?.map((friend) => (
            <FriendListItem key={friend.id} friend={friend} sessionid={props.sessionid} />
        ))}
    </ul>
}
export default FriendsList;
