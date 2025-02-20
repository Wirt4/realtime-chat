import { MessageService } from "@/services/message/service";
import { nanoid } from "nanoid";
import { PusherSendMessageInterface } from "@/services/pusher/interfaces";
import { aFriendsRepository } from "@/repositories/friends/abstract";
import { aMessageRepository } from "@/repositories/message/removeAll/abstract";
import { aSendMessageRepository } from "@/repositories/message/send/abstract";
import { aChatProfileRepository } from "@/repositories/chatProfile/abstract";
import { messageRepositoryFactory, messagePusherFactory } from "@/services/message/factories";


jest.mock("nanoid", () => ({
    nanoid: jest.fn(),
}));

jest.mock('@/services/message/factories', () => ({
    messageRepositoryFactory: jest.fn(),
    messagePusherFactory: jest.fn(),
}));

describe('isChatMember tests', () => {
    let profile: SenderHeader
    let service: MessageService
    let profileRepo: aChatProfileRepository
    let repositoryFacade: any
    let pusher: PusherSendMessageInterface
    beforeEach(() => {
        repositoryFacade = {
            getChatProfile: jest.fn().mockResolvedValue({ members: new Set(['foo', 'bar']), id: 'generated-id' }),
            userExists: jest.fn(),
            sendMessage: jest.fn(),
            getMessage: jest.fn(),
            removeAllMessages: jest.fn(),
            getMessages: jest.fn()

        }
        pusher = {
            sendMessage: jest.fn()
        }
        profile = {
            sender: "foo",
            id: "generated-id"
        };
        (messageRepositoryFactory as jest.Mock).mockReturnValue(repositoryFacade);
        (messagePusherFactory as jest.Mock).mockReturnValue(pusher);
        service = new MessageService()
    })
    it('user is a part of the chat', () => {
        expect(service.isChatMember(profile)).resolves.toEqual(true)
    })
    it('user is not a part of the chat', () => {
        profile.sender = 'batman'
        expect(service.isChatMember(profile)).resolves.toEqual(false)
    })
})
/*
describe('areFriends tests', () => {
    let friendsRepo: aFriendsRepository
    let service: MessageService
    let profile: SenderHeader
    beforeEach(() => {
        friendsRepo = {
            exists: jest.fn().mockResolvedValue(true),
            get: jest.fn(),
            add: jest.fn(),
            remove: jest.fn(),
        }
        service = new MessageService()
        profile = {
            sender: 'foo',
            id: 'bar--foo'
        }
    })
    it('users are friends', async () => {
        expect(await service.areFriends(profile, friendsRepo)).toEqual(true)
    })
    it('users are not friends', async () => {
        friendsRepo.exists = jest.fn().mockResolvedValue(false)
        expect(await service.areFriends(profile, friendsRepo)).toEqual(false)
    })
    it('confirm parameters passed to repository', async () => {
        await service.areFriends(profile, friendsRepo)
        expect(friendsRepo.exists).toHaveBeenCalledWith('foo', 'bar')
    })
})

describe('sendMessage tests', () => {
    beforeAll(() => {
        jest.useFakeTimers()
    })
    let service: MessageService
    let repo: aSendMessageRepository
    let text: string
    let profile: SenderHeader
    let pusher: PusherSendMessageInterface
    beforeEach(() => {
        jest.resetAllMocks()
        service = new MessageService()
        repo = {
            sendMessage: jest.fn()
        }
        text = 'hello'
        profile = {
            sender: 'foo',
            id: 'bar--foo'
        }
        pusher = {
            sendMessage: jest.fn()
        }
    })
    afterAll(() => {
        jest.useRealTimers()
    })
    it('confirm parameters passed to repository', async () => {
        await service.sendMessage(profile, text, repo, pusher)
        expect(repo.sendMessage).toHaveBeenCalledWith(profile.id, expect.anything())
    })
    it('the message passed to the repository should be stamped with nanoId', async () => {
        (nanoid as jest.Mock).mockReturnValue('c-3po');
        await service.sendMessage(profile, text, repo, pusher)
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
    })
})

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
