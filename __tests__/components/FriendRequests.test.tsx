import '@testing-library/jest-dom';
import FriendRequests from "@/components/FriendRequests";
import {render, screen} from "@testing-library/react";

describe('FriendRequests', () => {
    test('final state of friend requests is 0, should render "Nothing to show here..." ',()=>{
        render(<FriendRequests />);
        const text = screen.getByText('Nothing to show here...');
        expect(text).toBeInTheDocument();
    });
});