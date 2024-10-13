import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';
import FriendRequestSidebarOptions from "@/components/FriendRequestSidebarOptions";

describe('FriendRequestSidebarOptions', () => {
    test('Component renders without error', ()=>{
        render(<FriendRequestSidebarOptions initialUnseenRequestCount={0}/>);
    });

    test('Component contains a link', ()=>{
        render(<FriendRequestSidebarOptions initialUnseenRequestCount={0}/>);
        const linkElement = screen.getByRole('link');
        expect(linkElement).toBeInTheDocument();
    });

    test('Link points to /dashboard/requests', ()=>{
        render(<FriendRequestSidebarOptions initialUnseenRequestCount={0}/>);
        const linkElement = screen.getByRole('link');
        expect(linkElement).toBeInTheDocument();
        expect(linkElement).toHaveAttribute('href', '/dashboard/requests');
    });

    test('Component should contain User Icon',()=>{
        render(<FriendRequestSidebarOptions initialUnseenRequestCount={0}/>);
        const name = screen.getByLabelText('User');
        expect(name).toBeInTheDocument();
    });

    test('Component should contain text "Friend Requests"',()=>{
        render(<FriendRequestSidebarOptions initialUnseenRequestCount={0}/>);
        const label = screen.getByText("Friend Requests");
        expect(label).toBeInTheDocument();
    });

    test('If count is greater than 0, display it',()=>{
        render(<FriendRequestSidebarOptions initialUnseenRequestCount={3}/>);
        const label = screen.getByText("3");
        expect(label).toBeInTheDocument();
    });

    test('If count is greater than 0, display it, different number',()=>{
        render(<FriendRequestSidebarOptions initialUnseenRequestCount={7}/>);
        const label = screen.getByText("7");
        expect(label).toBeInTheDocument();
    });
});
