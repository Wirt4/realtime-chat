import '@testing-library/jest-dom';
import FriendRequests from "@/components/FriendRequests";
import {render, screen} from "@testing-library/react";

describe('FriendRequests', () => {
    test('final state of friend requests is 0, should render "Nothing to show here..." ',()=>{
        render(<FriendRequests />);
        const text = screen.getByText('Nothing to show here...');
        expect(text).toBeInTheDocument();
    });
    test('if the component receives a list of length 2, then there should be two UserPlus icons in the document',()=>{
        render(<FriendRequests />);
        const icons = screen.getAllByLabelText('AddUser');
        expect(icons).toHaveLength(2);
    })
});