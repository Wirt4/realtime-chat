export abstract class aAddFriendsFacade {
    abstract store(ids: Ids): Promise<void>;
}
