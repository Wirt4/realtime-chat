import '@testing-library/jest-dom';
import FriendRequests from "@/components/FriendRequests";
import {render, screen, waitFor, within, fireEvent} from "@testing-library/react";
import axios from 'axios';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('FriendRequests', () => {
    beforeEach(()=>{
        mockedAxios.post.mockImplementation(jest.fn())
    })
    afterEach(()=>{
        jest.resetAllMocks()
    })
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
        const text = screen.queryByText('Nothing to show here...');
        expect(text).not.toBeInTheDocument();
    });

    test('sender emails should be listed',()=>{
        const requests = [{senderId:'foo', senderEmail: 'foo@bar.com'}, {senderId: 'bar', senderEmail: 'bar@foo.com'}]
        render(<FriendRequests incomingFriendRequests={requests}/>);
        const button1 = screen.queryByText('foo@bar.com');
        const button2 = screen.queryByText('bar@foo.com');
        expect(button1).toBeInTheDocument();
        expect(button2).toBeInTheDocument();
    });

    test('if the component receives a list of length 2, then there should be two elements with the label "accept friend"',()=>{
        const requests = [{senderId:'foo', senderEmail: 'foo@bar.com'}, {senderId: 'bar', senderEmail: 'bar@foo.com'}]
        render(<FriendRequests incomingFriendRequests={requests} />);
        const buttons = screen.getAllByLabelText('accept friend');
        expect(buttons).toHaveLength(2);
    });

    test('elements with the label "accept friend" should be a button',()=>{
        const requests = [{senderId:'foo', senderEmail: 'foo@bar.com'}]
        render(<FriendRequests incomingFriendRequests={requests} />);
        const button = screen.getByLabelText('accept friend');
        expect(button.tagName).toBe('BUTTON');
    });

    test('accept friend should contain a checkmark',()=>{
        const requests = [{senderId:'foo', senderEmail: 'foo@bar.com'}]
        render(<FriendRequests incomingFriendRequests={requests} />);
        const button = screen.getByLabelText('accept friend');
        const check = within(button).getByLabelText('checkmark');
        expect(check).toBeInTheDocument();
    });

    test('if the component receives a list of length 2, then there should be two elements with the label "deny friend"',
        ()=>{
        const requests = [{senderId:'foo', senderEmail: 'foo@bar.com'}, {senderId: 'bar', senderEmail: 'bar@foo.com'}]
        render(<FriendRequests incomingFriendRequests={requests} />);
        const buttons = screen.getAllByLabelText('deny friend');
        expect(buttons).toHaveLength(2);
    });

    test('elements with the label "deny friend" should be a button',()=>{
        const requests = [{senderId:'foo', senderEmail: 'foo@bar.com'}]
        render(<FriendRequests incomingFriendRequests={requests} />);
        const button = screen.getByLabelText('deny friend');
        expect(button.tagName).toBe('BUTTON');
    });

    test('deny friend should contain a x',()=>{
        const requests = [{senderId:'foo', senderEmail: 'foo@bar.com'}]
        render(<FriendRequests incomingFriendRequests={requests} />);
        const button = screen.getByLabelText('deny friend');
        const check = within(button).getByLabelText('x');
        expect(check).toBeInTheDocument();
    });

    test('when accept friend is clicked, axios should be called with the endpoint /api/friends/accept', async ()=>{
        const requests = [{senderId:'foo', senderEmail: 'foo@bar.com'}];
        const {getByLabelText} = render(<FriendRequests incomingFriendRequests={requests} />);
        const button = getByLabelText('accept friend');
        fireEvent.click(button);
        await waitFor(()=>{
            expect(mockedAxios.post).toHaveBeenCalledWith('/api/friends/accept', expect.anything());
        });
    });
    test('when accept friend is clicked, axios should be called with the opts {id: senderId}', async ()=>{
        const requests = [{senderId:'foo', senderEmail: 'foo@bar.com'}];
        const {getByLabelText} = render(<FriendRequests incomingFriendRequests={requests} />);
        const button = getByLabelText('accept friend');
        fireEvent.click(button);
        await waitFor(()=>{
            expect(mockedAxios.post).toHaveBeenCalledWith(expect.anything(), {id: 'foo'});
        });
    });
    test('when accept friend is clicked, axios should be called with the opts {id: senderId}, differnt data', async ()=>{
        const requests = [{senderId:'bar', senderEmail: 'foo@bar.com'}];
        const {getByLabelText} = render(<FriendRequests incomingFriendRequests={requests} />);
        const button = getByLabelText('accept friend');
        fireEvent.click(button);
        await waitFor(()=>{
            expect(mockedAxios.post).toHaveBeenCalledWith(expect.anything(), {id: 'bar'});
        });
    });
});
