import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FriendListItemAPIActions from '@/components/Sidebar/FriendListItemAPIActions/component';
import axios from 'axios';
import '@testing-library/jest-dom';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('FriendActions', () => {
    const friendId = 'fun-test-id';

    beforeEach(() => {
        mockedAxios.post.mockReset();
    });

    it('renders the actions correctly', () => {
        const { getByText } = render(<FriendListItemAPIActions id={friendId} />);

        expect(getByText('Chat')).toBeInTheDocument();
        expect(getByText('Remove Friend')).toBeInTheDocument();
    });

    it('makes an API call when "Remove Friend" is clicked', async () => {
        mockedAxios.post.mockResolvedValueOnce({ status: 200 });
        render(<FriendListItemAPIActions id={friendId} />);
        const removeButton = screen.getByText('Remove Friend');

        fireEvent.click(removeButton);

        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledWith('/api/friends/remove', { idToRemove: friendId });
        });

    });

    it('makes an API call and hides the actions when "Remove Friend" is clicked', async () => {
        mockedAxios.post.mockResolvedValueOnce({ status: 200 });
        render(<FriendListItemAPIActions id={friendId} />);
        const removeButton = screen.getByText('Remove Friend');

        fireEvent.click(removeButton);

        await waitFor(() => {
            expect(screen.queryByText('Chat')).not.toBeInTheDocument();
            expect(screen.queryByText('Remove Friend')).not.toBeInTheDocument();
        });
    });

    it('handles API errors gracefully', async () => {
        mockedAxios.post.mockRejectedValueOnce(new Error('API Error'));
        render(<FriendListItemAPIActions id={friendId} />);
        const removeButton = screen.getByText('Remove Friend');
        fireEvent.click(removeButton);

        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledWith('/api/friends/remove', { idToRemove: friendId });
        });

        // Ensure actions are still visible after a failed request
        expect(screen.getByText('Chat')).toBeInTheDocument();
        expect(screen.getByText('Remove Friend')).toBeInTheDocument();
    });
});
