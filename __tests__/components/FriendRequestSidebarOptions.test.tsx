import '@testing-library/jest-dom';
import {render, screen} from '@testing-library/react';
import FriendRequestSidebarOptions from "@/components/FriendRequestSidebarOptions";

describe('FriendRequestSidebarOptions', () => {
    test('Component renders without error', ()=>{
        render(<FriendRequestSidebarOptions/>);
    });

    test('Component contains a link', ()=>{
        render(<FriendRequestSidebarOptions/>);
        const linkElement = screen.getByRole('link');
        expect(linkElement).toBeInTheDocument();
    });

    test('Link points to /dashboard/requests', ()=>{
        render(<FriendRequestSidebarOptions/>);
        const linkElement = screen.getByRole('link');
        expect(linkElement).toBeInTheDocument();
        expect(linkElement).toHaveAttribute('href', '/dashboard/requests');
    });

    test('Component should contain User Icon',()=>{
        render(<FriendRequestSidebarOptions/>);
        const name = screen.getByLabelText('User');
        expect(name).toBeInTheDocument();
    });
});
