import {FriendsAbstractInterface} from "@/repositories/friendsRepositoryInterface";

export interface Ids{
    toAdd: string,
    userId: string
}

export class ServiceFriendsAbstract {
    async userExists(email: string, friendsRepository: FriendsAbstractInterface): Promise<boolean>{
        return friendsRepository.userExists(email)
    }

    async areAlreadyFriends(ids: Ids, friendsRepository: FriendsAbstractInterface): Promise<boolean>{
        return friendsRepository.areFriends(ids.userId, ids.toAdd)
    }
    async isAlreadyAddedToFriendRequests(ids: Ids, friendsRepository: FriendsAbstractInterface): Promise<boolean>{
        return friendsRepository.hasExistingFriendRequest(ids.userId, ids.toAdd)
    }
}
