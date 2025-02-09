import { FriendRequestSidebarOptionsProps } from "@/components/Sidebar/SidebarOptions/friendRequestSidebarOptions/interface";
import { aFriendsRepository } from "@/repositories/friends/abstract";

export async function FriendRequestSidebarOptionsPropsFactory(sessionId: string, repository: aFriendsRepository): Promise<FriendRequestSidebarOptionsProps> {
    const friendRequests = await repository.get(sessionId);
    return new FriendRequestSidebarOptionsPropsContainer(sessionId, friendRequests);
}

export class FriendRequestSidebarOptionsPropsContainer implements FriendRequestSidebarOptionsProps {
    private friendRequests: string[]
    public sessionId: string
    constructor(sessionId: string, friendRequests: string[],) {
        this.sessionId = sessionId
        this.friendRequests = friendRequests
    }

    get initialRequestCount(): number {
        return this.friendRequests?.length || 0
    }
} 
