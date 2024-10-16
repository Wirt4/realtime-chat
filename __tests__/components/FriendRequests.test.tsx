import '@testing-library/jest-dom';
import FriendRequests from "@/components/FriendRequests";
import {render, screen, waitFor, within, fireEvent} from "@testing-library/react";
//mocks
import axios from 'axios';
import {useRouter} from "next/navigation";
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));


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
        const buttons = screen.getAllByLabelText(/accept friend*/i);
        expect(buttons).toHaveLength(2);
    });

    test('elements with the label "accept friend" should be a button',()=>{
        const requests = [{senderId:'foo', senderEmail: 'foo@bar.com'}]
        render(<FriendRequests incomingFriendRequests={requests} />);
        const button = screen.getByLabelText(/accept friend*/i);
        expect(button.tagName).toBe('BUTTON');
    });

    test('accept friend should contain a checkmark',()=>{
        const requests = [{senderId:'foo', senderEmail: 'foo@bar.com'}]
        render(<FriendRequests incomingFriendRequests={requests} />);
        const button = screen.getByLabelText(/accept friend*/i);
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
        const button = getByLabelText(/accept friend*/i);
        fireEvent.click(button);
        await waitFor(()=>{
            expect(mockedAxios.post).toHaveBeenCalledWith('/api/friends/accept', expect.anything());
        });
    });
    test('when accept friend is clicked, axios should be called with the opts {id: senderId}', async ()=>{
        const requests = [{senderId:'foo', senderEmail: 'foo@bar.com'}];
        const {getByLabelText} = render(<FriendRequests incomingFriendRequests={requests} />);
        const button = getByLabelText(/accept friend*/i);
        fireEvent.click(button);
        await waitFor(()=>{
            expect(mockedAxios.post).toHaveBeenCalledWith(expect.anything(), {id: 'foo'});
        });
    });
    test('when accept friend is clicked, axios should be called with the opts {id: senderId}, differnt data', async ()=>{
        const requests = [{senderId:'bar', senderEmail: 'foo@bar.com'}];
        const {getByLabelText} = render(<FriendRequests incomingFriendRequests={requests} />);
        const button = getByLabelText(/accept friend*/i);
        fireEvent.click(button);
        await waitFor(()=>{
            expect(mockedAxios.post).toHaveBeenCalledWith(expect.anything(), {id: 'bar'});
        });
    });

    test('if accept friend is clicked, setFriendRequests should be called with every sender id except the current one',
        async ()=>{
            const requests = [{senderId:'michael', senderEmail: 'michael@correlone.edu'},
                {senderId: 'sonny', senderEmail: 'santino@correlone.edu'},  {senderId: 'fredo', senderEmail: 'fredo@correlone.edu'},
                {senderId: 'tom', senderEmail: 'foo@bar.com'}]
            const {getByRole} = render(<FriendRequests incomingFriendRequests={requests} />);
            const button = getByRole('button', {
                name: /accept friend: fredo@correlone.edu/i
            });

            fireEvent.click(button);

            await waitFor(()=>{
                expect( screen.queryByText('fredo@correlone.edu')).not.toBeInTheDocument();
                expect( screen.queryByText('santino@correlone.edu')).toBeInTheDocument();
                expect( screen.queryByText('michael@correlone.edu')).toBeInTheDocument();

            });
        });
    test('when accept friend is clicked, should refersh the page', async ()=>{
        const spy = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({
            refresh: spy, // Mock the refresh function
        });
        const requests = [{senderId:'foo', senderEmail: 'foo@bar.com'}];
        const {getByLabelText} = render(<FriendRequests incomingFriendRequests={requests} />);
        const button = getByLabelText(/accept friend*/i);
        fireEvent.click(button);
        await waitFor(()=>{
            expect(spy).toHaveBeenCalled();
        });
    });
});
