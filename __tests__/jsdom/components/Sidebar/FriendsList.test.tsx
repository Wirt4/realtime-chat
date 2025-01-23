import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import FriendsList from '@/components/Sidebar/FriendsList/component';
import { FriendsListProps } from '@/components/Sidebar/FriendsList/interface';

const mockFriends = ['Charlie', 'Alice', 'Bob'];

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
            expect(screen.getByText(friend)).toBeInTheDocument();
        });
    });
});
