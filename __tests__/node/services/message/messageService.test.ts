import { MessageService } from "@/services/message/service";
import { messageRepositoryFactory } from "@/services/message/factories";
import { MessageRepositoryFacade } from "@/services/message/repositoryFacade";
import { PusherSendMessageInterface } from "@/services/pusher/interfaces";
import { SenderHeader } from "@/schemas/senderHeaderSchema";


jest.mock("nanoid", () => ({
    nanoid: jest.fn(),
}));

jest.mock('@/services/message/factories', () => ({
    messageRepositoryFactory: jest.fn(),
    messagePusherFactory: jest.fn(),
}));
/*
describe('isChatMember tests', () => {
    let profile: SenderHeader
    let service: MessageService
    let repositoryFacade: MessageRepositoryFacade
    beforeEach(() => {
        repositoryFacade = {
            getChatProfile: jest.fn().mockResolvedValue({ members: new Set(['foo', 'bar']), id: 'generated-id' }),
            friendshipExists: jest.fn().mockResolvedValue(true),
            sendMessage: jest.fn(),
            getMessage: jest.fn(),
            removeAllMessages: jest.fn(),
            getMessages: jest.fn(),
            removeChat: jest.fn()

        }
        profile = {
            sender: "foo",
            id: "generated-id"
        };
        (messageRepositoryFactory as jest.Mock).mockReturnValue(repositoryFacade);
        service = new MessageService()
    })
    it('user is a part of the chat', () => {
        expect(service.isValidChatMember(profile)).resolves.toEqual(true)
    })
    it('user is not a part of the chat', () => {
        profile.sender = 'batman'
        expect(service.isValidChatMember(profile)).resolves.toEqual(false)
    });
    it('if the chatProfile has zero members, return false', async () => {
        repositoryFacade.getChatProfile = jest.fn().mockResolvedValue({ members: new Set(), id: 'generated-id' });
        (messageRepositoryFactory as jest.Mock).mockReturnValue(repositoryFacade);
        expect(service.isValidChatMember(profile)).resolves.toEqual(false);
    });
    it('if the user is friends with no one in the chat, return false', async () => {
        repositoryFacade.getChatProfile = jest.fn().mockResolvedValue({ members: new Set(['foo', 'bar', 'pew']), id: 'generated-id' });
        repositoryFacade.friendshipExists = jest.fn().mockResolvedValue(false);
        (messageRepositoryFactory as jest.Mock).mockReturnValue(repositoryFacade);

        expect(service.isValidChatMember(profile)).resolves.toEqual(false);
    });
});
*/
describe('sendMessage tests', () => {
    let repositoryFacade: MessageRepositoryFacade;
    beforeAll(() => {
        jest.useFakeTimers()
    })
    let pusher: PusherSendMessageInterface;
    let service: MessageService;
    let profile: SenderHeader;
    let text: string;
    beforeEach(() => {
        jest.resetAllMocks();
        repositoryFacade = {
            getChatProfile: jest.fn(),
            friendshipExists: jest.fn(),
            sendMessage: jest.fn(),
            getMessage: jest.fn(),
            removeAllMessages: jest.fn(),
            getMessages: jest.fn(),
            removeChat: jest.fn()

        }
        text = 'hello'
        profile = {
            sender: 'foo',
            id: 'bar--foo'
        }
        pusher = {
            sendMessage: jest.fn()
        };
        (messageRepositoryFactory as jest.Mock).mockReturnValue(repositoryFacade);
        service = new MessageService();
    })
    afterAll(() => {
        jest.useRealTimers()
    })
    it('precondition: profile is a SenderHeader type', async () => {
        try {
            await service.sendMessage({} as SenderHeader, text)
            fail('should have thrown an error')
        } catch (e) {
            expect(e).toEqual(new Error('Invalid chat profile'))
        }
    });
    it("precondition: text is a non-empty string", async () => {
        try {
            await service.sendMessage(profile, "")
            fail('should have thrown an error')
        } catch (e) {
            expect(e).toEqual(new Error('Invalid message text'))
        }
    });

    /*it('the message passed to the repository should be stamped with nanoId', async () => {
        (nanoid as jest.Mock).mockReturnValue('c-3po');
        await service.sendMessage(profile, text)
        expect(repo.sendMessage).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ id: 'c-3po' }))
    })
    it('the message passed to the repository should be stamped with nanoId', async () => {
        (nanoid as jest.Mock).mockReturnValue('c-3po');
        await service.sendMessage(profile, text, repo, pusher)
        expect(repo.sendMessage).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ id: 'c-3po' }))
    })
    it('the message passed to the repository should be stamped with the correct senderId from the profile', async () => {
        await service.sendMessage(profile, text, repo, pusher)
        expect(repo.sendMessage).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ senderId: profile.sender }))
    })
    it('the message passed to the repository should be set with the text', async () => {
        jest.setSystemTime(new Date(1730156654))
        await service.sendMessage(profile, text, repo, pusher)
        expect(repo.sendMessage).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ timestamp: 1730156654 }))
    })
    it('confirm parameters passed to repository', async () => {
        await service.sendMessage(profile, text, repo, pusher)
        expect(pusher.sendMessage).toHaveBeenCalledWith(profile.id, expect.anything())
    })*/
})

/*
describe('deleteChat tests', () => {
    let service: MessageService
    let repo: aMessageRepository
    let chatId: string
    beforeEach(() => {
        repo = {
            removeAllMessages: jest.fn(),
        }
        service = new MessageService()
        chatId = 'foo--bar'
    })
    it('confirm parameters passed to repository', async () => {
        await service.deleteChat(chatId, repo)
        expect(repo.removeAllMessages).toHaveBeenCalledWith(chatId)
    })
})


describe('getMessages tests', () => {
    it('confirm parameters passed to repository', async () => {
        const repo = {
            getMessages: jest.fn(),
        }
        const service = new MessageService()
        const chatId = 'foo--bar'
        await service.getMessages(chatId, repo)
        expect(repo.getMessages).toHaveBeenCalledWith(chatId)
    });
    it('confirm parameters passed to repository', async () => {
        const messages = [{ text: "hello" }]
        const repo = {
            getMessages: jest.fn().mockResolvedValue(messages),
        }
        const service = new MessageService()
        const chatId = 'foo--bar'
        const result = await service.getMessages(chatId, repo)
        expect(result).toEqual(messages);
    });
});
*/
