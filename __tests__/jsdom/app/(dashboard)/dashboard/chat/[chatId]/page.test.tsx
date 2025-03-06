import '@testing-library/jest-dom'

import { render } from '@testing-library/react';
import Page from '@/app/(dashboard)/dashboard/chat/[chatId]/page'
import { notFound } from "next/navigation";
import myGetServerSession from '@/lib/myGetServerSession';
import { ChatProfileService } from '@/services/chatProfile/implementation';
import { MessageService } from '@/services/message/service';

jest.mock("next/navigation", () => ({
    notFound: jest.fn(),
}));
jest.mock('@/lib/pusher', () => ({
    getPusherClient: jest.fn(),
}))

jest.mock('@/services/message/service', () => {
    return {
        MessageService: jest.fn().mockImplementation(() => ({
            getMessages: jest.fn()
        }))
    }
});

jest.mock('@/services/chatProfile/implementation', () => {
    return {
        ChatProfileService: jest.fn().mockImplementation(() => ({
            getProfile: jest.fn(),
            getUsers: jest.fn(),
        })),
    };
})

jest.mock("@/lib/myGetServerSession", () => jest.fn());

const mockGetProfile = jest.fn();
const mockGetUsers = jest.fn();

describe('ChatPage renders with expected content', () => {
    let testId: string;
    beforeEach(() => {
        jest.resetAllMocks();
        testId = "sidmaksfwalrwams8sjfnakwej4vgy8sdv2w--8ansdkfanwjawf-0k2kas-asjfacvgte4567";
        (myGetServerSession as jest.Mock).mockResolvedValue({ user: { id: 'userid1' } });
        (ChatProfileService as unknown as jest.Mock).mockImplementation(() => ({
            getProfile: mockGetProfile,
            getUsers: mockGetUsers,
        }));
        (MessageService as unknown as jest.Mock).mockImplementation(() => ({
            getMessages: jest.fn().mockResolvedValue([
                { id: '1', chatId: testId, senderId: 'userid1', content: 'Hello, this is Bob', timestamp: new Date() }
            ])
        }));

        mockGetProfile.mockResolvedValue({ members: new Set(['userid1', 'userid2']), id: testId });
        mockGetUsers.mockResolvedValue([
            { id: 'userid1', name: 'Session User', email: 'stub', image: '/stub' },
            { id: 'userid2', name: 'Bob', email: 'stub', image: '/stub' },
        ]);
        //todo: mock message retrieval
    });

    test('page renders', async () => {
        render(await Page({ params: { chatId: testId } }));
        expect(notFound).not.toHaveBeenCalled();
    });

    test("if chatId is empty, notFound is called", async () => {
        render(await Page({ params: { chatId: "" } }));
        expect(notFound).toHaveBeenCalled();
    });
    test("if chatId is invalid formatting , notFound is called", async () => {
        render(await Page({ params: { chatId: "badformatting" } }));
        expect(notFound).toHaveBeenCalled();
    });
    test("if session is null, notFound is called", async () => {
        (myGetServerSession as jest.Mock).mockResolvedValue(null);
        render(await Page({ params: { chatId: testId } }));
        expect(notFound).toHaveBeenCalled();
    });
    test("getProfile should be called with testId", async () => {
        render(await Page({ params: { chatId: testId } }));
        expect(mockGetProfile).toHaveBeenCalledWith(testId);
    });
    test("if getProfile resoves to null, then not found", async () => {
        mockGetProfile.mockResolvedValue(null);
        render(await Page({ params: { chatId: testId } }));
        expect(notFound).toHaveBeenCalled();
    });
    test("if the session users id is not a part of the chat profile, then not found", async () => {
        (myGetServerSession as jest.Mock).mockResolvedValue({ user: { id: 'outsiderid' } });
        render(await Page({ params: { chatId: testId } }));
        expect(notFound).toHaveBeenCalled();
        expect(mockGetUsers).not.toHaveBeenCalled();
    });
    test("getusers should be called with testid", async () => {
        render(await Page({ params: { chatId: testId } }));
        expect(mockGetUsers).toHaveBeenCalledWith(testId);
    });
    test("page should diplay with 'Chat With <Partner>'", async () => {
        const { getByText } = render(await Page({ params: { chatId: testId } }));
        expect(getByText("Chat With Bob")).toBeInTheDocument();
    });
    /*test("page should render with the chat content returned by the messages", async () => {
        const { getByText } = render(await Page({ params: { chatId: testId } }));
        expect(getByText("Hello, this is Bob")).toBeInTheDocument();
    });*/
});
