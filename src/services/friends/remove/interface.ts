import {IAbstractFriendsService} from "@/services/friends/abstract/interface";

export interface IRemoveFriendsService extends IAbstractFriendsService{
    removeFriends(ids: Ids): Promise<void>
}
