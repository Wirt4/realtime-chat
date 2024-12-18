import '@testing-library/jest-dom'
import Layout from "@/app/(dashboard)/dashboard/layout"
import myGetServerSession from "@/lib/myGetServerSession";
import {notFound} from "next/navigation"
import fetchRedis from "@/helpers/redis";
import { render, screen, waitFor} from "@testing-library/react";
import FriendRequestSidebarOptions from "@/components/friendRequestSidebarOptions/FriendRequestSidebarOptions";
import getFriendsById from "@/helpers/getFriendsById";
import SidebarChatList from "@/components/SidebarChatList";

jest.mock("@/components/SidebarChatList");
jest.mock("@/components/friendRequestSidebarOptions/FriendRequestSidebarOptions");
jest.mock("@/lib/myGetServerSession",()=> jest.fn());
jest.mock("@/helpers/redis", ()=> jest.fn());
jest.mock("@/helpers/getFriendsById", ()=>jest.fn());

jest.mock("next/navigation", () => ({
    __esModule: true,
    notFound: jest.fn()
}));

describe('Layout tests',()=>{
    beforeEach(()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: 'foo'}});
        (fetchRedis as jest.Mock).mockResolvedValue(['foo']);
        (getFriendsById as jest.Mock).mockResolvedValue([{
            name: 'bob',
            email: 'test.user@gmail.com',
            image: 'stub',
            id: '1701',
        }]);
        (SidebarChatList as jest.Mock).mockImplementation(() => {
            return <ul aria-label='chat list'/>;
        });
    })
    afterEach(()=>{
        jest.resetAllMocks();
    });

    test('renders without crashing', async () => {
        render(await Layout())
    });

    test('renders children',async ()=>{
        render(await Layout({children: <div>Tossed Salads and Scrambled eggs</div>}));
        expect(screen.getByText('Tossed Salads and Scrambled eggs')).toBeInTheDocument();
    });

    test('should call a server session',async ()=>{
        render(await Layout());
        expect(myGetServerSession).toHaveBeenCalledTimes(1);
    });

    test("if it a bad session, then the layout should be notFound",async ()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue(null);
        render(await Layout());
        expect(notFound).toHaveBeenCalledTimes(1);
    });

    test("If it's a fine session, then  notFound should not be called",async ()=>{
        render(await Layout());
        expect(notFound).not.toHaveBeenCalled();
    });

    test("needs to include a Link to dashboard",async ()=>{
        render(await Layout());
        const linkElement = screen.getByRole('link', { name: '' });
        expect(linkElement).toHaveAttribute('href', "/dashboard");
    })

    test('Sidebar needs a div called "Your Chats"', async ()=> {
        render(await Layout());
        const text = screen.getByText('Your Chats');
        expect(text).toBeInTheDocument();
    });

    test('If getFriendsById resolves empty,  then don\'t display "Your Chats"', async ()=> {
        (getFriendsById as jest.Mock).mockResolvedValue([])
        render(await Layout());
        const text = screen.queryByText('Your Chats');
        expect(text).not.toBeInTheDocument();
    });

    test('Sidebar a nav for existing chats', async ()=> {
        render(await Layout());
        const navElement = await screen.findByRole('navigation');
        expect(navElement).toBeInTheDocument();
    });

    test('Output of fetchRedis is passed to  FriendRequestSidebarOptions', async ()=>{
        (fetchRedis as jest.Mock).mockResolvedValue(['first entry','second entry','third entry','fourth entry','fifth entry']);
        const friendRequestSpy = jest.fn();
        mockSideBarOptions(friendRequestSpy);
        render(await Layout());
        await waitFor(() => expect(friendRequestSpy).toHaveBeenCalledWith(5));
    });

    test('Output of fetchRedis is passed to  FriendRequestSidebarOptions, different data', async ()=>{
        (fetchRedis as jest.Mock).mockResolvedValue(['first entry','second entry']);
        const friendRequestSpy = jest.fn();
        mockSideBarOptions(friendRequestSpy);

        render(await Layout());
        expect(friendRequestSpy).toHaveBeenCalledWith(2);
    });

    test ('confirm input passed to fetchRedis', async ()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: '1701'}});
        render(await Layout());
        expect(fetchRedis as jest.Mock).toHaveBeenCalledWith('smembers', 'user:1701:incoming_friend_requests');
    });

    test ('confirm input passed to fetchRedis', async ()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: '45654'}});
        render(await Layout());
        expect(fetchRedis as jest.Mock).toHaveBeenCalledWith('smembers', 'user:45654:incoming_friend_requests');
    });

    test ('Should contain a SignOut Button', async ()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: '45654'}});
        const {queryByLabelText} = render(await Layout());
        const logoutButton = queryByLabelText('sign out button');
        expect(logoutButton).toBeInTheDocument();
    });

    test('getFriendRequest should be called with the userid from the session', async()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: '1234'}});

        render(await Layout());

        expect(getFriendsById as jest.Mock).toHaveBeenCalledWith('1234');
    });

    test('should contain a SidebarChatList component', async()=>{
        const {queryByLabelText} = render(await Layout());

        const sideBarOptions = queryByLabelText('chat list');
        expect(sideBarOptions).toBeInTheDocument();
    });

    test('Output of getFriendsById is passed to  SidebarChatList', async ()=>{
        (getFriendsById as jest.Mock).mockResolvedValue([]);
        const chatListSpy = jest.fn();
        mockSideBarChatList(chatListSpy)

        render(await Layout());
        await waitFor(() => expect(chatListSpy).toHaveBeenCalledWith(expect.objectContaining({friends:[]})));
    });

    test('Output of getFriendsById is passed to SidebarChatList', async ()=>{
        (getFriendsById as jest.Mock).mockResolvedValue([{
            name: 'alice',
            email: 'emailr@gmail.com',
            image: 'stub',
            id: '9177',
        }]);
        const childComponentSpy = jest.fn();
        (SidebarChatList as jest.Mock).mockImplementation(({ friends }) => {
            childComponentSpy(friends);
            return <div data-testid="child-component">Mocked Child</div>;
        });
        render(await Layout());
        await waitFor(() => expect(childComponentSpy).toHaveBeenCalledWith([{
            name: 'alice',
            email: 'emailr@gmail.com',
            image: 'stub',
            id: '9177',
        }]));
    });

    test('Output of myGetServerSession is passed to SideBarChatList', async()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: 'thx-1138'}});
        const chatListSpy = jest.fn();
        mockSideBarChatList(chatListSpy)

        render(await Layout());

        expect(chatListSpy).toHaveBeenCalledWith(expect.objectContaining({sessionId: 'thx-1138'}));
    })

    test('Output of myGetServerSession is passed to SideBarChatList, different data', async()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: 'r2-d2'}});
        const chatListSpy = jest.fn();
        mockSideBarChatList(chatListSpy)

        render(await Layout());

        expect(chatListSpy).toHaveBeenCalledWith(expect.objectContaining({sessionId: 'r2-d2'}));
    })
});

const mockSideBarChatList = (spy: jest.Mock)=>{
    (SidebarChatList as jest.Mock).mockImplementation(props => {
        spy(props);
        return <div data-testid="child-component">Mocked Child</div>;
    });
}

const mockSideBarOptions = (spy: jest.Mock)=>{
    (FriendRequestSidebarOptions as jest.Mock).mockImplementation(({ initialRequestCount }) => {
        spy(initialRequestCount);
        return <div data-testid="child-component">Mocked Child</div>;
    });
}
