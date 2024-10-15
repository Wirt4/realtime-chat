import '@testing-library/jest-dom'
import Layout from "@/app/(dashboard)/layout"
import myGetServerSession from "@/lib/myGetServerSession";
import {act} from "react";
import {notFound} from "next/navigation"
import fetchRedis from "@/helpers/redis";
import {render, screen, waitFor} from "@testing-library/react";
import FriendRequestSidebarOptions from "@/components/friendRequestSidebarOptions/FriendRequestSidebarOptions";

jest.mock("../../../src/components/friendRequestSidebarOptions/FriendRequestSidebarOptions")

jest.mock("../../../src/lib/myGetServerSession",()=>({
    __esModule: true,
    default: jest.fn()
}));

jest.mock("next/navigation", () => ({
    __esModule: true,
    notFound: jest.fn()
}));

jest.mock("../../../src/helpers/redis", ()=>({
    __esModule: true,
    default: jest.fn()
}))

describe('Layout tests',()=>{
    beforeEach(()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: 'foo'}});
        (fetchRedis as jest.Mock).mockResolvedValue(['foo'])
    })
    afterEach(()=>{
        jest.resetAllMocks();
    });

    test('renders without crashing', async () => {
        await act(async () => {
            render(<Layout>layout children</Layout>);
        });
    });

    test('renders children',async ()=>{
        await act(async () => {
            render(<Layout><div>Tossed Salads and Scrambled eggs</div></Layout>);
        });
        expect(screen.getByText('Tossed Salads and Scrambled eggs')).toBeInTheDocument();
    });

    test('should call a server session',async ()=>{
        await act(async () => {
            render(<Layout><div>Tossed Salads and Scrambled eggs</div></Layout>);
        });
        expect(myGetServerSession).toHaveBeenCalledTimes(1);
    });

    test("if it a bad session, then the layout should be notFound",async ()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue(null);
        await act(async () => {
            render(<Layout><div>Tossed Salads and Scrambled eggs</div></Layout>);
        })
        expect(notFound).toHaveBeenCalledTimes(1);
    });

    test("If it's a fine session, then  notFound should not be called",async ()=>{
        await act(async () => {
            render(<Layout><div>Tossed Salads and Scrambled eggs</div></Layout>);
        })
        expect(notFound).not.toHaveBeenCalled();
    });

    test("needs to include a Link to dashboard",async ()=>{
        await act(async () => {
            render(<Layout><div>Tossed Salads and Scrambled eggs</div></Layout>);
        });
        const linkElement = screen.getByRole('link', { name: '' });
        expect(linkElement).toHaveAttribute('href', "/dashboard");
    })

    test('Sidebar needs a div called "Your Chats"', async ()=> {
        await act(async () => {
            render(<Layout>
                <div>Tossed Salads and Scrambled eggs</div>
            </Layout>);
        });
        const text = screen.getByText('Your Chats');
        expect(text).toBeInTheDocument();
    });

    test('Sidebar a nav for existing chats', async ()=> {
        render(<Layout>example</Layout>);
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
        render(<Layout>test</Layout>)
        await waitFor(() => expect(childComponentSpy).toHaveBeenCalledWith(5));
    });

    test('Output of fetchRedis is passed to  FriendRequestSidebarOptions, different data', async ()=>{
        (fetchRedis as jest.Mock).mockResolvedValue(['first entry','second entry']);
        const childComponentSpy = jest.fn();
        (FriendRequestSidebarOptions as jest.Mock).mockImplementation(({ initialRequestCount }) => {
            childComponentSpy(initialRequestCount);
            return <div data-testid="child-component">Mocked Child</div>;
        });
        render(<Layout>test</Layout>)
        await waitFor(() => expect(childComponentSpy).toHaveBeenCalledWith(2));
    });

    test ('confirm input passed to fetchRedis', async ()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: '1701'}});
        render(<Layout>test</Layout>)
        await waitFor(() =>  {
            expect(fetchRedis as jest.Mock).toHaveBeenCalledWith('smembers', 'user:1701:incoming_friend_requests');
        });
    });

    test ('confirm input passed to fetchRedis', async ()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: '45654'}});
        render(<Layout>test</Layout>)
        await waitFor(() =>  {
            expect(fetchRedis as jest.Mock).toHaveBeenCalledWith('smembers', 'user:45654:incoming_friend_requests');
        });
    });
});
