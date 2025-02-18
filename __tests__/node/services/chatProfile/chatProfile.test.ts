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

    test("service.getProfile passes the id to the chatprofile repository", async () => {
        const chatId = "123";
        await chatProfileService.getProfile(chatId);

        expect(mockProfileRepository.getChatProfile).toHaveBeenCalledWith(chatId);
    });
});

describe("GetUsers tests", () => {
    let mockProfileRepository: aChatProfileRepository;
    let chatProfileService: ChatProfileService;
    let mockIdGenerator: aIdGeneratorService;
    let mockUserRepository: aUserRepository;
    let user1: User
    let user2: User
    beforeEach(() => {
        jest.resetAllMocks();
        user1 = {
            name: "Mary",
            email: "stub",
            image: "/stub",
            id: "123"
        }
        user2 = {
            id: "789",
            name: "Sue",
            email: "stub",
            image: "/stub"
        }
        mockProfileRepository = {
            createChatProfile: jest.fn(),
            getChatProfile: jest.fn().mockResolvedValue({
                id: "456",
                members: new Set(["123", "789"])
            }),
            addChatMember: jest.fn(),
        }
        mockIdGenerator = {
            newId: jest.fn()
        }
        mockUserRepository = {
            getUserChats: jest.fn(),
            getUser: jest.fn().mockImplementation(async (userId) => {
                if (userId == "123") {
                    return user1;
                }
                return user2;
            }),
            exists: jest.fn(),
            getId: jest.fn(),
            removeUserChat: jest.fn(),
            addUserChat: jest.fn(),
        },

            chatProfileService = new ChatProfileService(mockProfileRepository, mockUserRepository, mockIdGenerator);
    });
    test("getUsers should return a set of users", async () => {
        const chatId = "456";
        const users = await chatProfileService.getUsers(chatId);

        expect(users).toEqual(new Set([user1, user2]));
    });
    test("getUsers should return the user profiles of each member of the chat", async () => {
        const chatId = "456";
        await chatProfileService.getUsers(chatId);

        expect(mockProfileRepository.getChatProfile).toHaveBeenCalledWith(chatId);
    })
})
