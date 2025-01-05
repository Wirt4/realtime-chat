import {IAbstractFriendsService} from "@/services/friends/abstract/interface";

export interface IAddFriendsService extends IAbstractFriendsService{
    handleFriendAdd(ids: Ids, senderEmail: string): Promise<void>
    getIdToAdd(email: string): Promise<string>,
    isSameUser(ids:Ids): boolean
    isAlreadyAddedToFriendRequests(ids: Ids): Promise<boolean>
    userExists(email: string ): Promise<boolean>
}
