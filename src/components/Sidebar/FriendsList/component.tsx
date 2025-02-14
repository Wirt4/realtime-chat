'use client';
import { FC } from 'react';
import { FriendsListProps } from './interface';

const FriendsList: FC<FriendsListProps> = ({ friends = [] }) => {

    return <><li data-testid="friend-item" /><li data-testid="friend-item" /><li data-testid="friend-item" /></>
}
export default FriendsList;
