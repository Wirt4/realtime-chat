import FriendsList from '@/components/Sidebar/FriendsList/component';
import { FriendsListProps } from '@/components/Sidebar/FriendsList/interface';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, within } from '@testing-library/react';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockFriends: string[] = ['Alice', 'Bob', 'Charlie'];

const renderComponent = (props: Partial<FriendsListProps> = {}) => {
    const defaultProps: FriendsListProps = {
        friends: mockFriends,
        ...props,
    };
    return render(<FriendsList {...defaultProps} />);
};

// filepath: /Users/wirtsalthouse/WebstormProjects/realtime-chat/src/components/Sidebar/FriendsList/component.test.tsx
describe('FriendsList', () => {
    test('calls API endpoint when "Remove Friend" is clicked', async () => {
        renderComponent();

        // Open the popup
        fireEvent.click(screen.getByText('Alice'));
        const aliceContainer = screen.getByText('Alice').closest('div');

        if (aliceContainer) {
            fireEvent.click(within(aliceContainer).getByText('Remove Friend'));
        }

        // Verify API call
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/friends/remove', expect.anything());
    });
});
