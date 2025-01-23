import { AddFriendService } from '@/services/friends/add/implementation';
import { aAddFriendsFacade } from '@/repositories/addFriendsFacade/abstract';
import { PusherAddFriendInterface } from '@/services/pusher/interfaces';
import { addFriendValidator } from "@/lib/validations/add-friend";

jest.mock('@/lib/validations/add-friend');

describe('addFriendService tests', () => {
    let ids: Ids;
    let email: string;
    let facade: aAddFriendsFacade;
    let pusher: PusherAddFriendInterface;
    let service: AddFriendService;

    beforeEach(() => {
        jest.resetAllMocks();
        ids = { requestId: 'a-request-id', sessionId: 'a-session-id' };
        email = 'senderEmail@test.com';
        facade = {
            store: jest.fn(),
            getUserId: jest.fn(),
            areFriends: jest.fn(),
            hasFriendRequest: jest.fn(),
            userExists: jest.fn().mockResolvedValue(true)
        };
        pusher = {
            addFriendRequest: jest.fn()
        }
        service = new AddFriendService(facade, pusher);
    });

    it('getIdToAdd error message value', async () => {
        const message = 'Invalid request payload';
        jest.spyOn(addFriendValidator, 'parse').mockImplementation(() => {
            throw new Error(message)
        });

        try {
            await service.getIdToAdd(email);
        } catch (error) {
            expect(error).toEqual(new Error(message));
        }
    });

    it('confirm parameter passed to validator', async () => {
        jest.spyOn(addFriendValidator, 'parse');

        await service.getIdToAdd(email);

        expect(addFriendValidator.parse).toHaveBeenLastCalledWith({ email: email });
    });

    it('getIdToAdd throws if the user does not exist', async () => {
        facade.userExists = jest.fn().mockResolvedValue(false);
        service = new AddFriendService(facade, pusher);

        try {
            await service.getIdToAdd(email);
            expect(true).toBe(false);
        } catch (error) {
            expect(error).toEqual(new Error('User does not exist'));
        }
    });

    it('if no errors, then getIdToAdd should reutrn facade.getUserId', async () => {
        const expected = 'a-user-id';
        facade.getUserId = jest.fn().mockResolvedValue(expected);
        service = new AddFriendService(facade, pusher);

        const result = await service.getIdToAdd(email);

        expect(result).toEqual(expected);
    });

    it('trigger event should call the pusher', async () => {
        await service.triggerEvent(ids, email);

        expect(pusher.addFriendRequest).toHaveBeenCalledTimes(1);
        expect(pusher.addFriendRequest).toHaveBeenCalledWith(ids.sessionId, ids.requestId, email);
    });

    it('storeFriendRequest should call the facade method store with ids', async () => {
        await service.storeFriendRequest(ids);
        expect(facade.store).toHaveBeenCalledTimes(1);
        expect(facade.store).toHaveBeenCalledWith(ids);
    });

    it('If storeFriendRequest is called with the same user, then it should throw', async () => {
        const ids = { requestId: 'identicalId', sessionId: 'identicalId' };
        try {
            await service.storeFriendRequest(ids);
            expect(true).toBe(false);
        } catch (error) {
            expect(error).toEqual(new Error("Users can't add themselves as friends"));
        }
    });

    it('if the session user has already added this person, then storeFriendRequest should throw', async () => {
        facade.hasFriendRequest = jest.fn().mockResolvedValue(true);

        try {
            await service.storeFriendRequest(ids);
            expect(true).toBe(false);
        } catch (error) {
            expect(error).toEqual(new Error("You've already added this user"));
        }
    });

    it('If the session user is already friends with the user, then storeFriendRequest should throw', async () => {
        facade.areFriends = jest.fn().mockResolvedValue(true);
        try {
            await service.storeFriendRequest(ids);
            expect(true).toBe(false);
        } catch (error) {
            expect(error).toEqual(new Error("You're already friends with this user"));
        }
    });
});
