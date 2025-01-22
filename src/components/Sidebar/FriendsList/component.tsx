import { FC } from "react";
import { FriendsListProps } from "./interface";
import Image from "next/image";

const FriendsList: FC<FriendsListProps> = (props) => {
    const { friends } = props;
    const imgaeSize = 32
    return (
        <ul className='sidebar-chat-list'>
            {friends?.sort((friendA: User, friendB: User) => {
                return friendA.name > friendB.name ? 1 : -1
            }).map((friend: User) => {
                return (<li className='sidebar-chat-list-item'>
                    <span >
                        <Image src={friend.image}
                            alt={friend.name}
                            referrerPolicy='no-referrer'
                            width={imgaeSize}
                            height={imgaeSize}
                            className='rounded-full'
                        />
                    </span>
                    <span className='truncate'>{friend.name}</span>
                </li>)
            })}
        </ul>)
}
export default FriendsList;
