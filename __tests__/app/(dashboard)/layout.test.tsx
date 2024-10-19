import '@testing-library/jest-dom'
import Layout from "@/app/(dashboard)/layout"
import myGetServerSession from "@/lib/myGetServerSession";
import {notFound} from "next/navigation"
import fetchRedis from "@/helpers/redis";
import {render, screen, waitFor} from "@testing-library/react";
import FriendRequestSidebarOptions from "@/components/friendRequestSidebarOptions/FriendRequestSidebarOptions";

jest.mock("../../../src/components/friendRequestSidebarOptions/FriendRequestSidebarOptions")

jest.mock("../../../src/lib/myGetServerSession",()=> jest.fn());

jest.mock("../../../src/helpers/redis", ()=> jest.fn());

jest.mock("next/navigation", () => ({
    __esModule: true,
    notFound: jest.fn()
}));

describe('Layout tests',()=>{
    beforeEach(()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: 'foo'}});
        (fetchRedis as jest.Mock).mockResolvedValue(['foo'])
    })
    afterEach(()=>{
        jest.clearAllMocks();
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

    test('Sidebar a nav for existing chats', async ()=> {
        render(await Layout());
        const navElement = await screen.findByRole('navigation');
        expect(navElement).toBeInTheDocument();
    });

    test('Output of fetchRedis is passed to  FriendRequestSidebarOptions', async ()=>{
        (fetchRedis as jest.Mock).mockResolvedValue(['first entry','second entry','third entry','fourth entry','fifth entry']);
        const childComponentSpy = jest.fn();
        (FriendRequestSidebarOptions as jest.Mock).mockImplementation(({ initialRequestCount }) => {
                childComponentSpy(initialRequestCount);
                return <div data-testid="child-component">Mocked Child</div>;
        });
        render(await Layout());
        await waitFor(() => expect(childComponentSpy).toHaveBeenCalledWith(5));
    });

    test('Output of fetchRedis is passed to  FriendRequestSidebarOptions, different data', async ()=>{
        (fetchRedis as jest.Mock).mockResolvedValue(['first entry','second entry']);
        const childComponentSpy = jest.fn();
        (FriendRequestSidebarOptions as jest.Mock).mockImplementation(({ initialRequestCount }) => {
            childComponentSpy(initialRequestCount);
            return <div data-testid="child-component">Mocked Child</div>;
        });
        render(await Layout());
        expect(childComponentSpy).toHaveBeenCalledWith(2);
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
});
