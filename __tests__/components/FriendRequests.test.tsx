import '@testing-library/jest-dom';
import FriendRequests from "@/components/FriendRequests";
import {render, screen} from "@testing-library/react";

describe('FriendRequests', () => {
    test('final state of friend requests is 0, should render "Nothing to show here..." ',()=>{
        render(<FriendRequests incomingFriendRequests={[]} />);
        const text = screen.getByText('Nothing to show here...');
        expect(text).toBeInTheDocument();
    });
    test('if the component receives a list of length 2, then there should be two UserPlus icons in the document',()=>{
        const requests = [{senderId:'foo', senderEmail: 'bar'}, {senderId: 'bar', senderEmail: 'foo'}]
        render(<FriendRequests incomingFriendRequests={requests}/>);
        const icons = screen.getAllByLabelText('add user');
        expect(icons).toHaveLength(2);
    });
    test('if the component receives a list of length 2, then there should be two UserPlus icons in the document',()=>{
        const requests = [{senderId:'foo', senderEmail: 'bar'}]
        render(<FriendRequests incomingFriendRequests={requests} />);
        const icons = screen.getAllByLabelText('add user');
        expect(icons).toHaveLength(1);
    });
    test('if (final) requests are greater than 0, do not render "Nothing to show here...',()=>{
        const requests = [{senderId:'foo', senderEmail: 'bar'}, {senderId: 'bar', senderEmail: 'foo'}]
        render(<FriendRequests incomingFriendRequests={requests}/>);
        const text = screen.getByText('Nothing to show here...');
        expect(text).not.toBeInTheDocument();
    })
});