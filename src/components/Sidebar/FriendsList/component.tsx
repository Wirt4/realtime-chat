import { FC } from "react";
import { FriendsListProps } from "./interface";
import PopupComponent from "../../ui/popup/component";


const FriendsList: FC<FriendsListProps> = (props) => {
    const { friends } = props;
    return (
        <ul className='sidebar-chat-list'>
            {friends?.sort((friendA: string, friendB: string) => {
                return friendA > friendB ? 1 : -1
            }).map((friend: string) => {
                return (<li className='sidebar-chat-list-item'>
                    <span className='truncate'>{friend}</span>
                    <PopupComponent />
                </li>)
            })}
        </ul>)
}
export default FriendsList;
