export interface FriendsListProps {
    friends: Profile[];
    sessionid: string;
}

interface Profile {
    name: string;
    id: string;
}
