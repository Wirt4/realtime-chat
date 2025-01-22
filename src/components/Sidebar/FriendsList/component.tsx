import { FC } from "react";
import { FriendsListProps } from "./interface";

const FriendsList: FC<FriendsListProps> = (props) => {
    const { friends } = props;
    return (
        <ul className='sidebar-chat-list'>
            {friends?.sort((friendA: User, friendB: User) => {
                return friendA.name > friendB.name ? 1 : -1
            }).map((friend: User) => {
                return (<li className='sidebar-chat-list-item'>
                    <span className='truncate'>{friend.name}</span>
                </li>)
            })}
        </ul>)
}
export default FriendsList;
