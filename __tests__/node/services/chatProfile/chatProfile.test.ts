import { ChatProfileService } from "@/services/chatProfile/implementation";
import chatProfileRepositoryFacade from "@/services/chatProfile/repositoryFacade";
import { aIdGeneratorService } from "@/services/idGenerator/abstract";
import repositoryFacadeFactory from "@/services/chatProfile/repositoryFacadeFactory";

jest.mock("@/services/chatProfile/repositoryFacadeFactory", () => jest.fn());

describe("ChatProfileService", () => {
    let mockIdGenerator: aIdGeneratorService;
    let mockFacade: chatProfileRepositoryFacade;
    let chatProfileService: ChatProfileService;

    beforeEach(() => {
        jest.resetAllMocks();
        mockFacade = {
            createChatProfile: jest.fn(),
            getChatProfile: jest.fn(),
            addChatMember: jest.fn(),
            overwriteProfile: jest.fn(),
            getUser: jest.fn(),
            getUserChats: jest.fn()
        }
        mockIdGenerator = {
            newId: jest.fn()
        };
        (repositoryFacadeFactory as jest.Mock).mockReturnValue(mockFacade);
        chatProfileService = new ChatProfileService(mockIdGenerator);
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
        chatProfileService = new ChatProfileService(mockIdGenerator);

        await chatProfileService.createChat();

        expect(chatProfileService.getChatId()).toEqual("123");
    });

    test('when createChat is called, it should pass the id to the repository.createNewProfile', async () => {
        mockIdGenerator = {
            newId: jest.fn().mockReturnValue("456")
        }
        chatProfileService = new ChatProfileService(mockIdGenerator);

        await chatProfileService.createChat();

        expect(mockFacade.createChatProfile).toHaveBeenCalledWith("456");
    });

    test('when addUserToChat is called, it should pass the chatId and userId to the repository.addUserToChat', async () => {
        const userId = "456";
        const chatId = "23442";
        mockIdGenerator = {
            newId: jest.fn().mockReturnValue(chatId)
        }
        chatProfileService = new ChatProfileService(mockIdGenerator);
        await chatProfileService.createChat();

        await chatProfileService.addUserToChat(userId);

        expect(mockFacade.addChatMember).toHaveBeenCalledWith(chatId, userId);
    });

    test('If loadProfileFromUsers is should call userReposistory.getUserChats for each user in users', async () => {
        const users = new Set(["123", "456"]);

        await chatProfileService.loadProfileFromUsers(users);

        expect(mockFacade.getUserChats).toHaveBeenCalledWith("123");
        expect(mockFacade.getUserChats).toHaveBeenCalledWith("456");
    });

    test('If the users have no chats in common, then the chatId should be set to an empty string', async () => {
        const users = new Set(["123", "456"]);
        mockFacade.getUserChats = jest.fn().mockImplementation(async (userId: string) => {
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
        mockFacade.getUserChats = jest.fn().mockImplementation(async (userId: string) => {
            if (userId == "123") {
                return new Set(["foo", "bar"]);
            }
            return new Set(["bar", "eggs"]);
        });
        mockFacade.getChatProfile = jest.fn().mockImplementation(async (chatId: string) => {
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
        mockFacade.getUserChats = jest.fn().mockImplementation(async (userId: string) => {
            if (userId == "123") {
                return new Set(["foo", "bar"]);
            }
            return new Set(["bar", "eggs"]);
        });
        mockFacade.getChatProfile = jest.fn().mockImplementation(async (chatId: string) => {
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

        expect(mockFacade.getChatProfile).toHaveBeenCalledWith(chatId);
    });
});

describe("GetUsers tests", () => {
    let chatProfileService: ChatProfileService;
    let mockIdGenerator: aIdGeneratorService;
    let mockFacade: chatProfileRepositoryFacade;
    let user1: User
    let user2: User
    let chatId: string
    beforeEach(() => {
        chatId = "456";
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
        mockFacade = {
            createChatProfile: jest.fn(),
            getChatProfile: jest.fn(),
            addChatMember: jest.fn(),
            overwriteProfile: jest.fn(),
            getUser: jest.fn(),
            getUserChats: jest.fn()
        }
        mockIdGenerator = {
            newId: jest.fn()
        };
        (repositoryFacadeFactory as jest.Mock).mockReturnValue(mockFacade);

        chatProfileService = new ChatProfileService(mockIdGenerator);
    });
    test("getUsers should return a set of users", async () => {
        mockFacade.getChatProfile = jest.fn().mockResolvedValue({ id: "456", members: new Set(["123", "789"]) });
        mockFacade.getUser = jest.fn().mockImplementation(async (userId) => {
            if (userId == "123") {
                return user1;
            }
            return user2;
        });
        (repositoryFacadeFactory as jest.Mock).mockReturnValue(mockFacade);

        const users = await chatProfileService.getUsers(chatId);

        expect(users).toEqual(new Set([user1, user2]));
    });

    test("if a user id does not exist in the repository, then the call should still return an array filled with the viable users", async () => {
        mockFacade.getChatProfile = jest.fn().mockResolvedValue({ id: "456", members: new Set(["123", "789"]) });
        mockFacade.getUser = jest.fn().mockImplementation(async (userId) => {
            if (userId == "123") {
                return user1;
            }
            throw ("user not found");
        });
        (repositoryFacadeFactory as jest.Mock).mockReturnValue(mockFacade);
        chatProfileService = new ChatProfileService(mockIdGenerator);

        const users = await chatProfileService.getUsers(chatId);

        expect(users).toEqual(new Set([user1]));
    });

    test("if a user profile does not exist, then the chat profile's members property should be updated and the repo over-written", async () => {

        mockFacade.getChatProfile = jest.fn().mockResolvedValue({ id: "456", members: new Set(["123", "missingUser"]) });
        mockFacade.getUser = jest.fn().mockImplementation(async (userId) => {
            if (userId == "123") {
                return user1;
            }
            throw ("user not found");
        });
        (repositoryFacadeFactory as jest.Mock).mockReturnValue(mockFacade);
        chatProfileService = new ChatProfileService(mockIdGenerator);
        const expected = {
            id: "456",
            members: new Set(["123"])
        }

        await chatProfileService.getUsers(chatId);

        expect(mockFacade.overwriteProfile).toHaveBeenCalledWith(expected);
    })

    test("if all users are valid, then the overWriteChatProfile should not be called", async () => {
        await chatProfileService.getUsers(chatId);

        expect(mockFacade.overwriteProfile).not.toHaveBeenCalled();
    })
})
