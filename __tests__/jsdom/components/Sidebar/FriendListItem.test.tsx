import FriendListItem from '@/components/Sidebar/FriendListItem/component';
import FriendListItemProps from '@/components/Sidebar/FriendListItem/interface';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import axios from 'axios';

jest.mock('axios');


const mockedAxios = axios as jest.Mocked<typeof axios>;

const renderComponent = (props: Partial<FriendListItemProps> = {}) => {
    const defaultProps: FriendListItemProps = {
        name: "Alice",
        id: "alice-id",
        ...props,
    };
    return render(<FriendListItem {...defaultProps} />);
};

describe('FriendListItem', () => {

    test('renders friend names correctly', () => {
        renderComponent();

        expect(screen.getByText("Alice")).toBeInTheDocument();
    });

    test('calls API endpoint when "Remove Friend" is clicked', async () => {
        renderComponent();
        // Open the popup
        fireEvent.click(screen.getByText('Alice'));
        const aliceContainer = screen.getByText('Alice').closest('div');

        if (aliceContainer) {
            fireEvent.click(within(aliceContainer).getByText('Remove Friend'));
        }

        // Verify API call
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/friends/remove', { idToRemove: "alice-id" });
    });

    test("Friend entry is not in ui when after 'Remove Friend' is clicked", async () => {
        renderComponent();

        // Mock the API response
        mockedAxios.post.mockResolvedValueOnce({ status: 200 });

        // Open the popup for Alice
        fireEvent.click(screen.getByText('Alice'));
        const aliceContainer = screen.getByText('Alice').closest('div');

        if (aliceContainer) {
            fireEvent.click(within(aliceContainer).getByText('Remove Friend'));
        }

        // Wait for the API call to complete and the friend to be removed
        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledWith('/api/friends/remove', { idToRemove: 'alice-id' });
            expect(screen.queryByText('Alice')).not.toBeInTheDocument();
        });
    });
})
