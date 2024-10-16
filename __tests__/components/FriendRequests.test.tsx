import '@testing-library/jest-dom';
import FriendRequests from "@/components/FriendRequests";
import {render, screen, waitFor, within, fireEvent} from "@testing-library/react";

import axios from 'axios';
import {useRouter} from "next/navigation";
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

describe('FriendRequests', () => {
    const requests1: FriendRequest []=  [
        {senderId:'foo', senderEmail: 'bar'},
        {senderId: 'bar', senderEmail: 'foo'}
    ];
    const requests2: FriendRequest [] = [
        {senderId:'foo', senderEmail: 'bar'}
    ];
    const requests3: FriendRequest []  = [
        {senderId:'michael', senderEmail: 'michael@correlone.edu'},
        {senderId: 'sonny', senderEmail: 'santino@correlone.edu'},
        {senderId: 'fredo', senderEmail: 'fredo@correlone.edu'},
        {senderId: 'tom', senderEmail: 'foo@bar.com'}
    ];

    beforeEach(()=>{
        mockedAxios.post.mockImplementation(jest.fn());
        (useRouter as jest.Mock).mockReturnValue({
            refresh: jest.fn(),
        });[]
    });

    afterEach(()=>{
        jest.resetAllMocks()
    });

    test('final state of friend requests is 0, should render "Nothing to show here..." ',()=>{
        render(<FriendRequests incomingFriendRequests={[]} />);
        const text = screen.getByText('Nothing to show here...');
        expect(text).toBeInTheDocument();
    });

    test('if the component receives a list of length 2, then there should be two UserPlus icons in the document',
        ()=>{
        render(<FriendRequests incomingFriendRequests = {requests1}/>);
        const icons = screen.getAllByLabelText('add user');
        expect(icons).toHaveLength(2);
    });

    test('if the component receives a list of length 2, then there should be two UserPlus icons in the document',
        ()=>{
        render(<FriendRequests incomingFriendRequests = {requests2} />);
        const icons = screen.getAllByLabelText('add user');
        expect(icons).toHaveLength(1);
    });

    test('if (final) requests are greater than 0, do not render "Nothing to show here...',()=>{
        render(<FriendRequests incomingFriendRequests = {requests1}/>);
        const text = screen.queryByText('Nothing to show here...');
        expect(text).not.toBeInTheDocument();
    });

    test('sender emails should be listed',()=>{
        render(<FriendRequests incomingFriendRequests = {requests1}/>);
        const button1 = screen.queryByText('foo@bar.com');
        const button2 = screen.queryByText('bar@foo.com');
        expect(button1).toBeInTheDocument();
        expect(button2).toBeInTheDocument();
    });

    test('if the component receives a list of length 2, then there should be two elements with the label "accept friend"',
        ()=>{
        render(<FriendRequests incomingFriendRequests = {requests1}/>);
        const buttons = screen.getAllByLabelText(/accept friend*/i);
        expect(buttons).toHaveLength(2);
    });

    test('elements with the label "accept friend" should be a button',()=>{
        render(<FriendRequests incomingFriendRequests = {requests2}/>);
        const button = screen.getByLabelText(/accept friend*/i);
        expect(button.tagName).toBe('BUTTON');
    });

    test('accept friend should contain a checkmark',()=>{
        render(<FriendRequests incomingFriendRequests = {requests2}/>);
        const button = screen.getByLabelText(/accept friend*/i);
        const check = within(button).getByLabelText('checkmark');
        expect(check).toBeInTheDocument();
    });

    test('if the component receives a list of length 2, then there should be two elements with the label "deny friend"',
        ()=>{
        render(<FriendRequests incomingFriendRequests = {requests1}/>);
        const buttons = screen.getAllByLabelText(/deny friend*/i);
        expect(buttons).toHaveLength(2);
    });

    test('elements with the label "deny friend" should be a button',()=>{
        render(<FriendRequests incomingFriendRequests = {requests1}/>);
        const button = screen.getByLabelText(/deny friend*/i);
        expect(button.tagName).toBe('BUTTON');
    });

    test('deny friend should contain a x',()=>{
        render(<FriendRequests incomingFriendRequests = {requests1}/>);
        const button = screen.getByLabelText(/deny friend*/i);
        const check = within(button).getByLabelText('x');
        expect(check).toBeInTheDocument();
    });

    test('when accept friend is clicked, axios should be called with the endpoint /api/friends/accept',
        async ()=>{
        const {getByLabelText} = render(<FriendRequests incomingFriendRequests = {requests1}/>);
        const button = getByLabelText(/accept friend*/i);
        fireEvent.click(button);
        await waitFor(()=>{
            expect(mockedAxios.post).toHaveBeenCalledWith('/api/friends/accept', expect.anything());
        });
    });

    test('when accept friend is clicked, axios should be called with the opts {id: senderId}', async ()=>{
        const {getByLabelText} = render(<FriendRequests incomingFriendRequests = {requests1}/>);
        const button = getByLabelText(/accept friend*/i);
        fireEvent.click(button);
        await waitFor(()=>{
            expect(mockedAxios.post).toHaveBeenCalledWith(expect.anything(), {id: 'foo'});
        });
    });

    test('when accept friend is clicked, axios should be called with the opts {id: senderId}, differnt data',
        async ()=>{
        const {getByLabelText} =  render(<FriendRequests incomingFriendRequests = {requests1}/>);
        const button = getByLabelText(/accept friend*/i);
        fireEvent.click(button);
        await waitFor(()=>{
            expect(mockedAxios.post).toHaveBeenCalledWith(expect.anything(), {id: 'bar'});
        });
    });

    test('if accept friend is clicked, setFriendRequests should be called with every sender id except the current one',
        async ()=>{
            const {getByRole} = render(<FriendRequests incomingFriendRequests={requests3} />);
            const button = getByRole('button', {
                name: /fredo@correlone.edu/i
            });

            fireEvent.click(button);

            await waitFor(()=>{
                expect( screen.queryByText('fredo@correlone.edu')).not.toBeInTheDocument();
                expect( screen.queryByText('santino@correlone.edu')).toBeInTheDocument();
                expect( screen.queryByText('michael@correlone.edu')).toBeInTheDocument();

            });
        });

    test('when accept friend is clicked, should refresh the page', async ()=>{
        const spy = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({
            refresh: spy, // Mock the refresh function
        });
        const {getByLabelText} = render(<FriendRequests incomingFriendRequests={requests1} />);
        const button = getByLabelText(/accept friend*/i);
        fireEvent.click(button);
        await waitFor(()=>{
            expect(spy).toHaveBeenCalled();
        });
    });

    test('when deny friend is clicked, axios should be called with the endpoint /api/friends/deny',
        async ()=>{
            const {getByLabelText} = render(<FriendRequests incomingFriendRequests={requests1} />);
            const button = getByLabelText(/deny friend*/i);
            fireEvent.click(button);
            await waitFor(()=>{
                expect(mockedAxios.post).toHaveBeenCalledWith('/api/friends/deny', expect.anything());
            });
        });

    test('when deny friend is clicked, axios should be called with the opts {id: senderId}', async ()=>{
        const {getByLabelText} = render(<FriendRequests incomingFriendRequests={requests1} />);
        const button = getByLabelText(/deny friend*/i);
        fireEvent.click(button);
        await waitFor(()=>{
            expect(mockedAxios.post).toHaveBeenCalledWith(expect.anything(), {id: 'foo'});
        });
    });

    test('when deny friend is clicked, axios should be called with the opts {id: senderId}, differnt data',
        async ()=>{
            const {getByLabelText} = render(<FriendRequests incomingFriendRequests={requests1} />);
            const button = getByLabelText(/deny friend*/i);
            fireEvent.click(button);
            await waitFor(()=>{
                expect(mockedAxios.post).toHaveBeenCalledWith(expect.anything(), {id: 'bar'});
            });
        });

    test('if deny friend is clicked, setFriendRequests should be called with every sender id except the current one',
        async ()=>{
            const {getByRole} = render(<FriendRequests incomingFriendRequests={requests3} />);
            const button = getByRole('button', {
                name: /deny friend: fredo@correlone.edu/i
            });

            fireEvent.click(button);

            await waitFor(()=>{
                expect( screen.queryByText('fredo@correlone.edu')).not.toBeInTheDocument();
                expect( screen.queryByText('santino@correlone.edu')).toBeInTheDocument();
                expect( screen.queryByText('michael@correlone.edu')).toBeInTheDocument();

            });
        });

    test('when deny friend is clicked, should refresh the page', async ()=>{
        const spy = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({
            refresh: spy,
        });
        const {getByLabelText} = render(<FriendRequests incomingFriendRequests={requests1} />);
        const button = getByLabelText(/deny friend*/i);
        fireEvent.click(button);
        await waitFor(()=>{
            expect(spy).toHaveBeenCalled();
        });
    });
});
