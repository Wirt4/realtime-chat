import { aChatProfileRepository } from "@/repositories/chatProfile/abstract";
import { aUserRepository } from "@/repositories/user/abstract";
import { ChatProfileService } from "@/services/chatProfile/implementation";
import { aIdGeneratorService } from "@/services/idGenerator/abstract";

describe("ChatProfileService", () => {
    let mockProfileRepository: aChatProfileRepository;
    let mockIdGenerator: aIdGeneratorService;
    let chatProfileService: ChatProfileService;
    let mockUserRepository: aUserRepository;

    beforeEach(() => {
        jest.resetAllMocks();
        mockProfileRepository = {
            createChatProfile: jest.fn(),
            getChatProfile: jest.fn(),
            addChatMember: jest.fn(),
        }
        mockIdGenerator = {
            newId: jest.fn()
        }
        mockUserRepository = {
            getUserChats: jest.fn().mockResolvedValue(new Set()),
            getUser: jest.fn(),
            exists: jest.fn(),
            getId: jest.fn(),
            removeUserChat: jest.fn(),
            addUserChat: jest.fn(),
        },

            chatProfileService = new ChatProfileService(mockProfileRepository, mockUserRepository, mockIdGenerator);
    });

    test('CreateChat Test should call idGenerator.create()', async () => {
        await chatProfileService.createChat();

        expect(mockIdGenerator.newId).toHaveBeenCalledTimes(1);
    });

    test('If getChatId is called before create, then it should throw', async () => {
        expect(() => chatProfileService.getChatId()).toThrow();
    });

    test('If getChatId is called before create, then it should throw', async () => {
        mockIdGenerator = {
            newId: jest.fn().mockReturnValue("123")
        }
        chatProfileService = new ChatProfileService(mockProfileRepository, mockUserRepository, mockIdGenerator);

        await chatProfileService.createChat();

        expect(chatProfileService.getChatId()).toEqual("123");
    });

    test('when createChat is called, it should pass the id to the repository.createNewProfile', async () => {
        mockIdGenerator = {
            newId: jest.fn().mockReturnValue("456")
        }
        chatProfileService = new ChatProfileService(mockProfileRepository, mockUserRepository, mockIdGenerator);

        await chatProfileService.createChat();

        expect(mockProfileRepository.createChatProfile).toHaveBeenCalledWith("456");
    });

    test('when addUserToChat is called, it should pass the chatId and userId to the repository.addUserToChat', async () => {
        const userId = "456";
        const chatId = "23442";
        mockIdGenerator = {
            newId: jest.fn().mockReturnValue(chatId)
        }
        chatProfileService = new ChatProfileService(mockProfileRepository, mockUserRepository, mockIdGenerator);
        await chatProfileService.createChat();

        await chatProfileService.addUserToChat(userId);

        expect(mockProfileRepository.addChatMember).toHaveBeenCalledWith(chatId, userId);
    });

    test('If addUserToChat is called before create, then it should throw', async () => {
        try {
            await chatProfileService.addUserToChat("456");
            fail("Should have thrown");
        } catch { }
    });

    test('If loadProfileFromUsers is called with an empty set, then it should throw "parameter users may not be an empty set"', async () => {
        try {
            await chatProfileService.loadProfileFromUsers(new Set());

            fail("Should have thrown");
        } catch (err) {
            if (err instanceof Error) {
                expect(err.message).toEqual("parameter \"users\" may not be an empty set");
            }
        }
    });

    test('If loadProfileFromUsers is called with an empty set, then it should throw "parameter users may not be an empty set"', async () => {
        try {
            await chatProfileService.loadProfileFromUsers(new Set());

            fail("Should have thrown");
        } catch (err) {
            if (err instanceof Error) {
                expect(err.message).toEqual("parameter \"users\" may not be an empty set");
            }
        }
    });
    test('If loadProfileFromUsers is should call userReposistory.getUserChats for each user in users', async () => {
        const users = new Set(["123", "456"]);

        await chatProfileService.loadProfileFromUsers(users);

        expect(mockUserRepository.getUserChats).toHaveBeenCalledWith("123");
        expect(mockUserRepository.getUserChats).toHaveBeenCalledWith("456");
    });

    test('If the users have no chats in common, then the chatId should be set to an empty string', async () => {
        const users = new Set(["123", "456"]);
        mockUserRepository.getUserChats = jest.fn().mockImplementation(async (userId: string) => {
            if (userId == "123") {
                return new Set(["foo", "bar"]);
            }
            return new Set(["spam", "eggs"]);
        })

        await chatProfileService.loadProfileFromUsers(users);

        expect(chatProfileService.getChatId()).toEqual("");
    });

    test("If the users have one chat in common, and they are the only participants of that chat then the chatId should be set to that chatid", async () => {
        const users = new Set(["123", "456"]);
        mockUserRepository.getUserChats = jest.fn().mockImplementation(async (userId: string) => {
            if (userId == "123") {
                return new Set(["foo", "bar"]);
            }
            return new Set(["bar", "eggs"]);
        });
        mockProfileRepository.getChatProfile = jest.fn().mockImplementation(async (chatId: string) => {
            if (chatId == "bar") {
                return {
                    members: new Set(["123", "456"])
                }
            }
            return {
                members: new Set(["123"])
            }
        })

        await chatProfileService.loadProfileFromUsers(users);

        expect(chatProfileService.getChatId()).toEqual("bar");
    });

    test("If the users have one chat in common, but  they aren't the only participants of that chat then the chatId should be set to  an empty string", async () => {
        const users = new Set(["123", "456"]);
        mockUserRepository.getUserChats = jest.fn().mockImplementation(async (userId: string) => {
            if (userId == "123") {
                return new Set(["foo", "bar"]);
            }
            return new Set(["bar", "eggs"]);
        });
        mockProfileRepository.getChatProfile = jest.fn().mockImplementation(async (chatId: string) => {
            if (chatId == "bar") {
                return {
                    members: new Set(["123", "456", "890"])
                }
            }
            return {
                members: new Set(["123"])
            }
        })

        await chatProfileService.loadProfileFromUsers(users);

        expect(chatProfileService.getChatId()).toEqual("");
    });

});
