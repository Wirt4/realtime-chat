import { aFriendsRepository } from '@/repositories/friends/abstract';
import { aRemoveFriendsService } from '@/services/friends/remove/abstact';
import { RemoveFriendsService } from '@/services/friends/remove/implementation';
import { idToRemoveSchema } from '@/schemas/idToRemoveSchema';
import { aUserRepository } from '@/repositories/user/abstract';
import { aMessageRepository } from '@/repositories/message/removeAll/abstract';
import { aChatProfileRepository } from '@/repositories/chatProfile/abstract';
jest.mock('@/schemas/idToRemoveSchema');

describe('removeFriendsService', () => {
    let mockFriendsRepo: aFriendsRepository;
    let mockUsersRepo: aUserRepository;
    let mockMessageRepo: aMessageRepository;
    let service: aRemoveFriendsService;
    let mockChatProfileRepo: aChatProfileRepository
    let requestId: string;
    let sessionId: string;

    beforeEach(() => {
        jest.resetAllMocks();
        mockFriendsRepo = {
            remove: jest.fn(),
            exists: jest.fn(),
            add: jest.fn(),
            get: jest.fn(),
        }
        mockUsersRepo = {
            getUserChats: jest.fn().mockResolvedValue([]),
            exists: jest.fn(),
            getId: jest.fn(),
            getUser: jest.fn(),
            removeUserChat: jest.fn(),
            addUserChat: jest.fn(),
        }
        mockMessageRepo = {
            removeAllMessages: jest.fn(),
        }
        mockChatProfileRepo = {
            getChatProfile: jest.fn(),
            createChatProfile: jest.fn(),
        }
        requestId = 'foo';
        sessionId = 'bar';
    })
    it('calling remove should call remove on the friends repository', async () => {
        mockFriendsRepo.exists = jest.fn().mockResolvedValue(true);
        service = new RemoveFriendsService(mockFriendsRepo, mockUsersRepo, mockMessageRepo, mockChatProfileRepo);

        await service.removeFriends({ requestId, sessionId });

        expect(mockFriendsRepo.remove).toHaveBeenCalledTimes(2);
        expect(mockFriendsRepo.remove).toHaveBeenCalledWith(requestId, sessionId);
        expect(mockFriendsRepo.remove).toHaveBeenCalledWith(sessionId, requestId);
    });
    it('calling remove should only call remove if the friend association exists', async () => {
        mockFriendsRepo.exists = jest.fn().mockResolvedValue(false);
        service = new RemoveFriendsService(mockFriendsRepo, mockUsersRepo, mockMessageRepo, mockChatProfileRepo);

        await service.removeFriends({ requestId, sessionId });

        expect(mockFriendsRepo.remove).not.toHaveBeenCalled();
    })

    it('calling getIdToRemove throw if parser throws', () => {
        const expectedError = new Error('bar');
        const spy = jest.spyOn(idToRemoveSchema, 'parse').mockImplementation(() => {
            throw expectedError;
        });
        const body = { idToRemove: 'foo' };
        service = new RemoveFriendsService(mockFriendsRepo, mockUsersRepo, mockMessageRepo);

        try {
            service.getIdToRemove(body);
            fail('should have thrown');
        } catch (e) {
            expect(e).toEqual(expectedError);
        } finally {
            expect(spy).toHaveBeenCalledWith(body);
        }
    });

    it('calling getIdToRemove should return the idToRemove', () => {
        const idToRemove = 'foo';
        const body = { idToRemove };
        jest.spyOn(idToRemoveSchema, 'parse').mockReturnValue(body);
        service = new RemoveFriendsService(mockFriendsRepo, mockUsersRepo, mockMessageRepo);
        expect(service.getIdToRemove(body)).toEqual(idToRemove);
    });

    it('Only the chat (or chats) that both users are members of should be removed', async () => {
        const idToRemove = 'foo';
        const body = { idToRemove };
        jest.spyOn(mockFriendsRepo, 'exists').mockResolvedValue(true);
        jest.spyOn(idToRemoveSchema, 'parse').mockReturnValue(body);
        jest.spyOn(mockUsersRepo, 'getUserChats').mockImplementation(async (id: string) => {
            if (id === requestId) {
                return new Set(['toremove', 'spam', 'quasi']);
            }
            if (id === sessionId) {
                return new Set(['quasi', 'eggs', 'toremove']);
            }
            return new Set();
        });
        jest.spyOn(mockChatProfileRepo, 'getChatProfile').mockImplementation(async (chatId: string) => {
            if (chatId === 'toremove') {
                return { id: 'toremove', members: new Set([requestId, sessionId]) };
            }
            if (chatId === 'spam') {
                return { id: 'spam', members: new Set([requestId, 'Leia']) };
            }
            if (chatId === 'quasi') {
                return { id: 'quasi', members: new Set([requestId, sessionId, 'Leia']) };
            }
            if (chatId === 'eggs') {
                return { id: 'eggs', members: new Set([sessionId, 'Leia']) };
            }
            const members: Set<string> = new Set([]);
            return { id: 'unexpected', members };
        })

        service = new RemoveFriendsService(mockFriendsRepo, mockUsersRepo, mockMessageRepo, mockChatProfileRepo);

        await service.removeFriends({ requestId, sessionId });

        expect(mockUsersRepo.getUserChats).toHaveBeenCalledTimes(2);
        expect(mockUsersRepo.getUserChats).toHaveBeenCalledWith(requestId);
        expect(mockUsersRepo.getUserChats).toHaveBeenCalledWith(sessionId);

        expect(mockChatProfileRepo.getChatProfile).toHaveBeenCalledTimes(2);
        expect(mockChatProfileRepo.getChatProfile).toHaveBeenCalledWith('toremove');
        expect(mockChatProfileRepo.getChatProfile).toHaveBeenCalledWith('quasi');

        expect(mockUsersRepo.removeUserChat).toHaveBeenCalledTimes(2);
        expect(mockUsersRepo.removeUserChat).toHaveBeenCalledWith(requestId, 'toremove');
        expect(mockUsersRepo.removeUserChat).toHaveBeenCalledWith(sessionId, 'toremove');

        expect(mockMessageRepo.removeAllMessages).toHaveBeenCalledTimes(1);
        expect(mockMessageRepo.removeAllMessages).toHaveBeenCalledWith('toremove');
    });
});
