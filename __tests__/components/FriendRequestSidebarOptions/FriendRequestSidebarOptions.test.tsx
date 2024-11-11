import '@testing-library/jest-dom';
import {render} from '@testing-library/react';
import FriendRequestSidebarOptions from "@/components/friendRequestSidebarOptions/FriendRequestSidebarOptions";


jest.mock('@/lib/pusher',()=>({
    getPusherClient:jest.fn().mockReturnValue({
        subscribe: jest.fn().mockReturnValue({bind: jest.fn()})
    })
}))

describe('FriendRequestSidebarOptions', () => {
   // let subscribeSpy: jest.SpyInstance;

   /** afterEach(()=>{
        jest.clearAllMocks();
    })**/

    test('Component renders without error', ()=>{
        render(<FriendRequestSidebarOptions sessionId='stub' initialRequestCount={0}/>);
    });

    test('Component contains a link', ()=>{
        const {getByRole} = render(<FriendRequestSidebarOptions sessionId='stub' initialRequestCount={0}/>);
        const linkElement = getByRole('link');
        expect(linkElement).toBeInTheDocument();
    });

    test('Link points to /dashboard/requests', ()=>{
        const {getByRole} = render(<FriendRequestSidebarOptions sessionId='stub' initialRequestCount={0}/>);
        const linkElement = getByRole('link');
        expect(linkElement).toBeInTheDocument();
        expect(linkElement).toHaveAttribute('href', '/dashboard/requests');
    });

    test('Component should contain User Icon',()=>{
        const {getByLabelText} = render(<FriendRequestSidebarOptions sessionId='stub' initialRequestCount={0}/>);
        const name = getByLabelText('User');
        expect(name).toBeInTheDocument();
    });

    test('Component should contain text "Friend Requests"',()=>{
        const {getByText} = render(<FriendRequestSidebarOptions sessionId='stub' initialRequestCount={0}/>);
        const label = getByText("Friend Requests");
        expect(label).toBeInTheDocument();
    });

    test('Given the initialRequestCount is 2: ' +
        'When the component is rendered, it should display 2',()=>{
        const {queryByText}=render(<FriendRequestSidebarOptions sessionId='stub' initialRequestCount={2}/>);
        const label = queryByText("2");
        expect(label).toBeInTheDocument();
    });

    test('Given the initialRequestCount is 7: ' +
        'When the component is rendered, it should display 7',()=>{
        const {queryByText}=render(<FriendRequestSidebarOptions sessionId='stub' initialRequestCount={7}/>);
        const label = queryByText("7");
        expect(label).toBeInTheDocument();
    });

    test("Given the initialRequestCount is 0: When the component renders, then the count will not be displayed",()=>{
        const {queryByText} = render(<FriendRequestSidebarOptions sessionId='stub' initialRequestCount={0}/>);
        const label = queryByText("0")
        expect(label).not.toBeInTheDocument();
    });

    test("Given the initialRequest count is 150: When the component renders, then it won't display the count",()=>{
        const {queryByText} = render(<FriendRequestSidebarOptions sessionId='stub' initialRequestCount={-50}/>);
        const label = queryByText("-50")
        expect(label).not.toBeInTheDocument();
    });
});

describe('Decrement display update tests',()=>{
    test("Given the initial request count is 4  sidebar shows a count of 4 requests: " +
        "When the user's friend_requests pusher channel fires a deny_friend event, Then the sidebar shows a count of 3 requests",()=>{

    })
})
