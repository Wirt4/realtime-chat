import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';
import FriendRequestSidebarOptions from "@/components/FriendRequestSidebarOptions";

describe('FriendRequestSidebarOptions', () => {
    test('Component renders without error', ()=>{
        render(<FriendRequestSidebarOptions initialRequestCount={0}/>);
    });

    test('Component contains a link', ()=>{
        render(<FriendRequestSidebarOptions initialRequestCount={0}/>);
        const linkElement = screen.getByRole('link');
        expect(linkElement).toBeInTheDocument();
    });

    test('Link points to /dashboard/requests', ()=>{
        render(<FriendRequestSidebarOptions initialRequestCount={0}/>);
        const linkElement = screen.getByRole('link');
        expect(linkElement).toBeInTheDocument();
        expect(linkElement).toHaveAttribute('href', '/dashboard/requests');
    });

    test('Component should contain User Icon',()=>{
        render(<FriendRequestSidebarOptions initialRequestCount={0}/>);
        const name = screen.getByLabelText('User');
        expect(name).toBeInTheDocument();
    });

    test('Component should contain text "Friend Requests"',()=>{
        render(<FriendRequestSidebarOptions initialRequestCount={0}/>);
        const label = screen.getByText("Friend Requests");
        expect(label).toBeInTheDocument();
    });

    test('If count is greater than 0, display it',()=>{
        render(<FriendRequestSidebarOptions initialRequestCount={3}/>);
        const label = screen.queryByText("3");
        expect(label).toBeInTheDocument();
    });

    test('If count is greater than 0, display it, different number',()=>{
        render(<FriendRequestSidebarOptions initialRequestCount={7}/>);
        const label = screen.queryByText("7");
        expect(label).toBeInTheDocument();
    });

    test("If count is equal to 0,  don't display it",()=>{
        render(<FriendRequestSidebarOptions initialRequestCount={0}/>);
        const label = screen.queryByText("0")
        expect(label).not.toBeInTheDocument();
    });

    test("If count is less than  0,  don't display it",()=>{
        render(<FriendRequestSidebarOptions initialRequestCount={-50}/>);
        const label = screen.queryByText("-50")
        expect(label).not.toBeInTheDocument();
    });
});
