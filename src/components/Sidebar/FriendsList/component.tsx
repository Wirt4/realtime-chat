import { FC } from "react";
import { FriendsListProps } from "./interface";
import Image from "next/image";

const FriendsList: FC<FriendsListProps> = (props) => {
    const { friends } = props;
    /**
      <Image src={friend.image}
                            fill
                            alt={friend.name}
                            referrerPolicy='no-referrer'
                            className='icone'
                        />
     */
    return (
        <ul className='sidebar-chat-list'>
            {friends.sort((friendA: User, friendB: User) => {
                return friendA.name < friendB.name ? -1 : 1
            }).map((friend: User) => {
                return (<li className='sidebar-chat-list-item'>
                    <span >
                        <Image src={friend.image}
                            alt={friend.name}
                            referrerPolicy='no-referrer'
                            width={32}
                            height={32}
                        />
                    </span>
                    <span className='truncate'>{friend.name}</span>
                </li>)
            })}
        </ul>)
}
export default FriendsList;
