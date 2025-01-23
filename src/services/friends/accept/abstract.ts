export abstract class aAcceptFriendsService {
    abstract handleRequest(ids: Ids): Promise<void>
}
