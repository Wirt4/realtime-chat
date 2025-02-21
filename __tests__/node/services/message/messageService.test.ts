import { MessageService } from "@/services/message/service";
import { messagePusherFactory, messageRepositoryFactory } from "@/services/message/factories";
import { MessageRepositoryFacade } from "@/services/message/repositoryFacade";
import { PusherSendMessageInterface } from "@/services/pusher/interfaces";
import { SenderHeader } from "@/schemas/senderHeaderSchema";
import { nanoid } from "nanoid";


jest.mock("nanoid", () => ({
    nanoid: jest.fn().mockReturnValue('nano-id-value'),
}));

jest.mock('@/services/message/factories', () => ({
    messageRepositoryFactory: jest.fn(),
    messagePusherFactory: jest.fn(),
}));

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
        (messagePusherFactory as jest.Mock).mockReturnValue(pusher);
        service = new MessageService();
        (nanoid as jest.Mock).mockReturnValue('stub');
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
    it("precondition: text is a non-empty string", async () => {
        try {
            await service.sendMessage(profile, "valid text")
        } catch (e) {
            fail('should not have thrown an error')
        }
    });
    it("precondition: text is a non-empty string", async () => {
        try {
            await service.sendMessage(profile, 3 as unknown as string);
            fail('should have thrown an error');
        } catch (e) {
            expect(e).toEqual(new Error('Invalid message text'));
        }
    });
    it("postcondition: message is sent to the repository complete with an id and timestamp", async () => {
        await service.sendMessage(profile, text)
        expect(repositoryFacade.sendMessage).toHaveBeenCalledWith(
            expect.stringContaining(profile.id),
            expect.objectContaining({
                id: expect.any(String),
                senderId: profile.sender,
                text,
                timestamp: expect.any(Number)
            }))

    });
    it("postcondition: message is sent to the pusher", async () => {
        await service.sendMessage(profile, text)
        expect(pusher.sendMessage).toHaveBeenCalledWith(
            expect.stringContaining(profile.id),
            expect.objectContaining({
                id: expect.any(String),
                senderId: profile.sender,
                text,
                timestamp: expect.any(Number)
            }))
    });

    it('the message passed to the repository should be stamped with nanoId', async () => {
        (nanoid as jest.Mock).mockReturnValue('c-3po');
        await service.sendMessage(profile, text)
        expect(repositoryFacade.sendMessage).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ id: 'c-3po' }))
    });
})


describe('deleteChat tests', () => {
    let repositoryFacade: MessageRepositoryFacade
    let service: MessageService
    let chatId: string
    beforeEach(() => {
        repositoryFacade = {
            getChatProfile: jest.fn(),
            friendshipExists: jest.fn(),
            sendMessage: jest.fn(),
            getMessage: jest.fn(),
            removeAllMessages: jest.fn(),
            getMessages: jest.fn(),
            removeChat: jest.fn()

        };
        (messageRepositoryFactory as jest.Mock).mockReturnValue(repositoryFacade);
        service = new MessageService();
        chatId = '123456789876543212345678909876543212--123456789876543212345678909876543212';
    });
    it('precondition: chatId is a nonempty string', async () => {
        try {
            await service.deleteChat("")
            fail('should have thrown an error')
        } catch (e) {
            expect(e).toEqual(new Error('Invalid chatId'))
        }
    });
    it('precondition: chatId is an invalid chat id', async () => {
        try {
            await service.deleteChat("bad format")
            fail('should have thrown an error')
        } catch (e) {
            expect(e).toEqual(new Error('Invalid chatId'))
        }
    });
    it('postcondition: repos removeAll is called', async () => {
        await service.deleteChat(chatId)
        expect(repositoryFacade.removeAllMessages).toHaveBeenCalledWith(chatId)
    });
});

describe('getMessages tests', () => {
    let chatId: string;
    let repositoryFacade: MessageRepositoryFacade;
    beforeEach(() => {
        repositoryFacade = {
            getChatProfile: jest.fn(),
            friendshipExists: jest.fn(),
            sendMessage: jest.fn(),
            getMessage: jest.fn(),
            removeAllMessages: jest.fn(),
            getMessages: jest.fn(),
            removeChat: jest.fn()

        };
        (messageRepositoryFactory as jest.Mock).mockReturnValue(repositoryFacade);
        chatId = '123456789876543212345678909876543212--123456789876543212345678909876543212';
    });
    it('precondition: chat id is a valid, nonempty string', async () => {
        ["", "bad format"].forEach(async (id) => {
            try {
                await new MessageService().getMessages(id)
                fail('should have thrown an error')
            } catch (e) {
                expect(e).toEqual(new Error('Invalid chatId'))
            }
        });
    });
    it("poscondition: returns an array of messages: must be an array", async () => {
        repositoryFacade.getMessages = jest.fn().mockResolvedValue(-1);
        (messageRepositoryFactory as jest.Mock).mockReturnValue(repositoryFacade);
        try {
            await new MessageService().getMessages(chatId);
            fail('should have thrown an error')
        } catch (e) {
            expect(e).toEqual(new Error('Repository error, invalid format'));
        }
    });
    it("poscondition: returns an array of messages", async () => {
        repositoryFacade.getMessages = jest.fn().mockResolvedValue([]);
        (messageRepositoryFactory as jest.Mock).mockReturnValue(repositoryFacade);
        try {
            await new MessageService().getMessages(chatId);
        } catch {
            fail('should not have thrown an error')
        }
    });
    it("poscondition: returns must be an array of messages", async () => {
        repositoryFacade.getMessages = jest.fn().mockResolvedValue(["foo", "bar"]);
        (messageRepositoryFactory as jest.Mock).mockReturnValue(repositoryFacade);
        try {
            await new MessageService().getMessages(chatId);
            fail('should not have thrown an error');
        } catch (e) {
            expect(e).toEqual(new Error('Repository error, invalid format'));
        }
    });
    it("calls the repo with the chat id", async () => {
        repositoryFacade.getMessages = jest.fn().mockResolvedValue([]);
        (messageRepositoryFactory as jest.Mock).mockReturnValue(repositoryFacade);
        await new MessageService().getMessages(chatId);
        expect(repositoryFacade.getMessages).toHaveBeenCalledWith(chatId);
    });
});
