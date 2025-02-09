import '@testing-library/jest-dom';
import { render, screen, within, fireEvent } from '@testing-library/react';
import FriendsList from '@/components/Sidebar/FriendsList/component';
import { FriendsListProps } from '@/components/Sidebar/FriendsList/interface';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockFriends: { name: string, id: string }[] = [{ name: 'Alice', id: 'alice-id' }, { name: 'Bob', id: 'bob-id' }, { name: 'Charlie', id: 'charlie-id' }];

const renderComponent = (props: Partial<FriendsListProps> = {}) => {
    const defaultProps: FriendsListProps = {
        friends: mockFriends,
        ...props,
    };
    return render(<FriendsList {...defaultProps} />);
};

describe('FriendsList', () => {
    test('renders the list of friends', () => {
        renderComponent();
        const listItems = screen.getAllByRole('listitem');
        expect(listItems).toHaveLength(3);
    });

    test('renders friends in alphabetical order', () => {
        renderComponent();
        const listItems = screen.getAllByRole('listitem');
        expect(listItems[0]).toHaveTextContent('Alice');
        expect(listItems[1]).toHaveTextContent('Bob');
        expect(listItems[2]).toHaveTextContent('Charlie');
    });

    test('renders friend names correctly', () => {
        renderComponent();
        mockFriends.forEach(friend => {
            expect(screen.getByText(friend.name)).toBeInTheDocument();
        });
    });
});

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
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/friends/remove', { idToRemove: "alice-id" });
    });
});
