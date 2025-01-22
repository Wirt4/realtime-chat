import '@testing-library/jest-dom'
import Layout from "@/app/(dashboard)/dashboard/layout"
import { notFound } from "next/navigation"
import { render, screen, waitFor } from "@testing-library/react";
import FriendRequestSidebarOptions from "@/components/Sidebar/SidebarOptions/friendRequestSidebarOptions/FriendRequestSidebarOptions";
import SidebarChatList from "@/components/Sidebar/ChatList/SidebarChatList";
import { dashboardDataFactory } from '@/services/dashboard/factory';
import { aDashboardData } from '@/services/dashboard/abstract';
import { Session } from 'next-auth';

jest.mock('@/services/dashboard/dashboardData', jest.fn())
jest.mock("@/components/Sidebar/ChatList/SidebarChatList");
jest.mock("@/components/Sidebar/SidebarOptions/friendRequestSidebarOptions/FriendRequestSidebarOptions");
jest.mock("@/services/dashboard/factory");
jest.mock("next/navigation", () => ({
    __esModule: true,
    notFound: jest.fn()
}));

describe('Layout tests', () => {
    let dashBoardData: aDashboardData;
    let session: Session;
    let friends: User[]
    let sessionId: string
    let friendRequests: string[]
    let initialRequestCount: number
    let chatId: string

    const mockDashBoardData = () => {
        return {
            getSession: jest.fn().mockResolvedValue(session),
            getSidebarProps: jest.fn().mockResolvedValue({ friends, friendRequestSidebarOptions: { initialRequestCount, sessionId }, sidebarChatlist: { friends, sessionId, chatId } }),
        };
    }


    beforeEach(() => {
        friends = [];
        sessionId = 'user-id';
        friendRequests = [];
        initialRequestCount = 0;
        chatId = 'chat-id';
        dashBoardData = mockDashBoardData();
        session = {
            user: {
                id: 'user-id',
                name: 'User',
                email: 'user@example.com',
            },
            expires: '2023-01-01T00:00:00.000Z',
        };
        (dashboardDataFactory as jest.Mock).mockReturnValue(dashBoardData);
        (SidebarChatList as jest.Mock).mockImplementation(() => {
            return <ul aria-label='chat list' />;
        });
    })
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('renders without crashing', async () => {
        render(await Layout())
    });

    test('renders children', async () => {
        render(await Layout({ children: <div>Tossed Salads and Scrambled eggs</div> }));
        expect(screen.getByText('Tossed Salads and Scrambled eggs')).toBeInTheDocument();
    });

    test('should call a server session', async () => {
        render(await Layout());
        expect(dashBoardData.getSession).toHaveBeenCalledTimes(1);
    });

    test("if it a bad session, then the layout should be notFound", async () => {
        jest.spyOn(dashBoardData, 'getSession').mockRejectedValueOnce(new Error('no session'));
        render(await Layout());
        expect(notFound).toHaveBeenCalledTimes(1);
    });

    test("If it's a fine session, then  notFound should not be called", async () => {
        jest.spyOn(dashBoardData, 'getSession').mockResolvedValue({ user: { id: '1234' } } as Session);
        render(await Layout());
        expect(notFound).not.toHaveBeenCalled();
    });

    test("needs to include a Link to dashboard", async () => {
        render(await Layout());
        const linkElement = screen.getByRole('link', { name: '' });
        expect(linkElement).toHaveAttribute('href', "/dashboard");
    })

    test('Sidebar needs a div called "Your Chats"', async () => {
        friends = [{ name: 'alice', email: 'alice@example.com', image: 'stub', id: '9177' }];
        (dashboardDataFactory as jest.Mock).mockReturnValue(mockDashBoardData());
        render(await Layout());
        const text = screen.getByText('Your Chats');
        expect(text).toBeInTheDocument();
    });

    test('If getFriendsById resolves empty,  then don\'t display "Your Chats"', async () => {
        friends = [];
        (dashboardDataFactory as jest.Mock).mockReturnValue(mockDashBoardData());
        render(await Layout());
        const text = screen.queryByText('Your Chats');
        expect(text).not.toBeInTheDocument();
    });

    test('Sidebar a nav for existing chats', async () => {
        render(await Layout());
        const navElement = await screen.findByRole('navigation');
        expect(navElement).toBeInTheDocument();
    });

    test('Output of getIncomingFriendRequests is passed to  FriendRequestSidebarOptions', async () => {
        initialRequestCount = 5;
        (dashboardDataFactory as jest.Mock).mockReturnValue(mockDashBoardData());
        const friendRequestSpy = jest.fn();
        mockSideBarOptions(friendRequestSpy);
        render(await Layout());
        await waitFor(() => expect(friendRequestSpy).toHaveBeenCalledWith(5));
    });

    test('Output of getIncomingFriendRequests is passed to  FriendRequestSidebarOptions, different data', async () => {
        initialRequestCount = 2;
        (dashboardDataFactory as jest.Mock).mockReturnValue(mockDashBoardData());
        const friendRequestSpy = jest.fn();
        mockSideBarOptions(friendRequestSpy);

        render(await Layout());
        expect(friendRequestSpy).toHaveBeenCalledWith(2);
    });

    test('confirm input passed to getIncomingFriendRequests', async () => {
        const spy = jest.spyOn(dashBoardData, 'getSidebarProps');
        const session = { user: { id: '1701' } } as Session;
        jest.spyOn(dashBoardData, 'getSession').mockResolvedValue(session);
        render(await Layout());
        expect(spy).toHaveBeenCalledWith(session);
    });

    test('confirm input passed to getIncomingFriendRequests', async () => {
        const session = { user: { id: '45654' } } as Session;
        jest.spyOn(dashBoardData, 'getSession').mockResolvedValue(session);
        const spy = jest.spyOn(dashBoardData, 'getSidebarProps');
        render(await Layout());
        expect(spy).toHaveBeenCalledWith(session);
    });

    test('Should contain a SignOut Button', async () => {
        jest.spyOn(dashBoardData, 'getSession').mockResolvedValue({ user: { id: '45654' } } as Session);
        const { queryByLabelText } = render(await Layout());
        const logoutButton = queryByLabelText('sign out button');
        expect(logoutButton).toBeInTheDocument();
    });


    test('should contain a SidebarChatList component', async () => {
        const { queryByLabelText } = render(await Layout());

        const sideBarOptions = queryByLabelText('chat list');
        expect(sideBarOptions).toBeInTheDocument();
    });

    test('Output of getFriendsById is passed to  SidebarChatList', async () => {
        friends = [];
        (dashboardDataFactory as jest.Mock).mockReturnValue(mockDashBoardData());
        const chatListSpy = jest.fn();
        mockSideBarChatList(chatListSpy)

        render(await Layout());
        await waitFor(() => expect(chatListSpy).toHaveBeenCalledWith(expect.objectContaining({ friends: [] })));
    });

    test('Output of getFriendsById is passed to SidebarChatList', async () => {
        const expected = [{
            name: 'alice',
            email: 'emailr@gmail.com',
            image: 'stub',
            id: '9177',
        }]
        friends = expected;
        (dashboardDataFactory as jest.Mock).mockReturnValue(mockDashBoardData());
        const childComponentSpy = jest.fn();
        (SidebarChatList as jest.Mock).mockImplementation(({ friends }) => {
            childComponentSpy(friends);
            return <div data-testid="child-component">Mocked Child</div>;
        });
        render(await Layout());
        await waitFor(() => expect(childComponentSpy).toHaveBeenCalledWith(expected));
    });

    test('Output of myGetServerSession is passed to SideBarChatList', async () => {
        sessionId = 'thx-1138';
        (dashboardDataFactory as jest.Mock).mockReturnValue(mockDashBoardData());
        const chatListSpy = jest.fn();
        mockSideBarChatList(chatListSpy)

        render(await Layout());

        expect(chatListSpy).toHaveBeenCalledWith(expect.objectContaining({ sessionId: 'thx-1138' }));
    });

    test('Output of myGetServerSession is passed to SideBarChatList, different data', async () => {
        sessionId = 'r2-d2';
        (dashboardDataFactory as jest.Mock).mockReturnValue(mockDashBoardData());
        const chatListSpy = jest.fn();
        mockSideBarChatList(chatListSpy)

        render(await Layout());

        expect(chatListSpy).toHaveBeenCalledWith(expect.objectContaining({ sessionId: 'r2-d2' }));
    });
});

const mockSideBarChatList = (spy: jest.Mock) => {
    (SidebarChatList as jest.Mock).mockImplementation(props => {
        spy(props);
        return <div data-testid="child-component">Mocked Child</div>;
    });
}

const mockSideBarOptions = (spy: jest.Mock) => {
    (FriendRequestSidebarOptions as jest.Mock).mockImplementation(({ initialRequestCount }) => {
        spy(initialRequestCount);
        return <div data-testid="child-component">Mocked Child</div>;
    });
}
