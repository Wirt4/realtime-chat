import { FC } from "react";
import { FriendsListProps } from "./interface";
import Image from "next/image";
import { Utils } from "@/lib/utils";

const FriendsList: FC<FriendsListProps> = (props) => {
    const { friends } = props;
    return (
        <ul className='sidebar-chat-list'>
            {friends.sort(Utils.userSort).map((friend: User) => {
                return (<li className='sidebar-chat-list-item'>
                    <span >
                        <Image src={friend.image}
                            alt={friend.name}
                            referrerPolicy='no-referrer'
                            width={32}
                            height={32}
                            className='rounded-full'
                        />
                    </span>
                    <span className='truncate'>{friend.name}</span>
                </li>)
            })}
        </ul>)
}
export default FriendsList;
