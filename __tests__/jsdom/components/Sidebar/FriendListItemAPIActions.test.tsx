import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FriendListItemAPIActions from '@/components/Sidebar/FriendListItemAPIActions/component';
import axios from 'axios';
import '@testing-library/jest-dom';
import { stat } from 'fs';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('FriendActions', () => {
    const friendId = 'fun-test-id';
    const userId = 'fun-test-user-id';

    beforeEach(() => {
        mockedAxios.post.mockReset();
        mockedAxios.post.mockImplementation(async (endpoint, payload) => {
            if (endpoint === '/api/chatprofile/getid') {
                return {
                    data: { chatId: 'fun-test-chat-id' },
                    status: 200
                }
            }
            return { status: 200 }
        });
    });

    it('renders the actions correctly', () => {
        const { getByText } = render(<FriendListItemAPIActions friendId={friendId} userId={userId} />);

        expect(getByText('Chat')).toBeInTheDocument();
        expect(getByText('Remove Friend')).toBeInTheDocument();
    });

    it('calls GET "/api/chatprofile/id" when "Remove Friend" is clicked', async () => {
        mockedAxios.post.mockResolvedValue({ status: 200 });
        render(<FriendListItemAPIActions friendId={friendId} userId={userId} />);
        const removeButton = screen.getByText('Remove Friend');

        fireEvent.click(removeButton);

        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledWith('/api/chatprofile/getid', expect.objectContaining({
                participants: expect.arrayContaining([friendId, userId])
            }));
        });
    });

    it('calls "/api/friends/remove" when "Remove Friend" is clicked', async () => {
        render(<FriendListItemAPIActions friendId={friendId} userId={userId} />);
        const removeButton = screen.getByText('Remove Friend');

        fireEvent.click(removeButton);

        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledWith('/api/friends/remove', { idToRemove: friendId });
        });
    });

    it('calls "/api/message/remove/all" when "Remove Friend" is clicked', async () => {
        render(<FriendListItemAPIActions friendId={friendId} userId={userId} />);
        const removeButton = screen.getByText('Remove Friend');

        fireEvent.click(removeButton);

        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledWith('/api/message/remove/all', expect.anything());
        });
    });

    it('calls "when  the return value of "/api/chatprofile/getid" is an empty string, then "/api/message/remove/all" is not triggered', async () => {
        mockedAxios.post.mockImplementation(async () => {
            return { data: { chatId: '' } }
        });
        render(<FriendListItemAPIActions friendId={friendId} userId={userId} />);
        const removeButton = screen.getByText('Remove Friend');

        fireEvent.click(removeButton);

        await waitFor(() => {
            expect(mockedAxios.post).not.toHaveBeenCalledWith('/api/message/remove/all', expect.anything());
        });
    });

    it('makes an API call and hides the actions when "Remove Friend" is clicked', async () => {
        render(<FriendListItemAPIActions friendId={friendId} userId={userId} />);
        const removeButton = screen.getByText('Remove Friend');

        fireEvent.click(removeButton);

        await waitFor(() => {
            expect(screen.queryByText('Chat')).not.toBeInTheDocument();
            expect(screen.queryByText('Remove Friend')).not.toBeInTheDocument();
        });
    });

    it('handles API errors gracefully', async () => {
        mockedAxios.post.mockRejectedValueOnce(new Error('API Error'));
        render(<FriendListItemAPIActions friendId={friendId} userId={userId} />);
        const removeButton = screen.getByText('Remove Friend');

        fireEvent.click(removeButton);

        await waitFor(() => {
            expect(screen.getByText('Chat')).toBeInTheDocument();
            expect(screen.getByText('Remove Friend')).toBeInTheDocument();
        });
    });
});

