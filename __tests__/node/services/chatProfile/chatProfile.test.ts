import { aChatProfileRepository } from "@/repositories/chatProfile/abstract";
import { ChatProfileService } from "@/services/chatProfile/implementation";
import { aIdGeneratorService } from "@/services/idGenerator/abstract";
describe("ChatProfileService", () => {
    let mockRepository: aChatProfileRepository;
    let mockIdGenerator: aIdGeneratorService;
    let chatProfileService: ChatProfileService;

    beforeEach(() => {
        jest.resetAllMocks();
        mockRepository = {
            createChatProfile: jest.fn(),
            getChatProfile: jest.fn(),
            addChatMember: jest.fn()
        }
        mockIdGenerator = {
            newId: jest.fn()
        }
        chatProfileService = new ChatProfileService(mockRepository, mockIdGenerator);
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
        chatProfileService = new ChatProfileService(mockRepository, mockIdGenerator);

        await chatProfileService.createChat();

        expect(chatProfileService.getChatId()).toEqual("123");
    });

    test('when createChat is called, it should pass the id to the repository.createNewProfile', async () => {
        mockIdGenerator = {
            newId: jest.fn().mockReturnValue("456")
        }
        chatProfileService = new ChatProfileService(mockRepository, mockIdGenerator);

        await chatProfileService.createChat();

        expect(mockRepository.createChatProfile).toHaveBeenCalledWith("456");
    });

    test('when addUserToChat is called, it should pass the chatId and userId to the repository.addUserToChat', async () => {
        const userId = "456";
        const chatId = "23442";
        mockIdGenerator = {
            newId: jest.fn().mockReturnValue(chatId)
        }
        chatProfileService = new ChatProfileService(mockRepository, mockIdGenerator);
        await chatProfileService.createChat();

        await chatProfileService.addUserToChat(userId);

        expect(mockRepository.addChatMember).toHaveBeenCalledWith(chatId, userId);
    });

    test('If addUserToChat is called before create, then it should throw', async () => {
        try {
            await chatProfileService.addUserToChat("456");
            fail("Should have thrown");
        } catch { }
    });
});
