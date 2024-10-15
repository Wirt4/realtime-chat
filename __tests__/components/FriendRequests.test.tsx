import '@testing-library/jest-dom';
import FriendRequests from "@/components/FriendRequests";
import {render, screen} from "@testing-library/react";

describe('FriendRequests', () => {
    test('Should render a div that reads "FriendRequests',()=>{
        render(<FriendRequests />);
        const text = screen.getByText('FriendRequest');
        expect(text).toBeInTheDocument();
    })
})