export default interface FriendListItemProps {
    friend: FriendInfo;
    sessionid: string;
}

export interface FriendInfo {
    id: string;
    name: string;
}
