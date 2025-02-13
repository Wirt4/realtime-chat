import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FriendListItem from '@/components/Sidebar/FriendListItem/component';
//import FriendListItemAPIActions from '@components/Sidebar/FriendListItemAPIActions/component';

//jest.mock('@components/Sidebar/FriendListItemAPIActions/component', () => jest.fn(() => <div data-testid="friend-actions" />));

describe('FriendItem', () => {
    const friend = {
        id: 'test-friend-id',
        name: 'John Doe',
    };

    it('renders the friend name correctly', () => {
        render(<FriendListItem friend={friend} />);

        expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('actions should not be initially visible when document is loaded', () => {
        render(<FriendListItem friend={friend} />);
        expect(screen.queryByTestId('friend-actions')).not.toBeInTheDocument();
    });

    /**
     * it('toggles FriendActions when the name is clicked', () => {
        render(<FriendItem friend={friend} />);
        
        const nameElement = screen.getByText('John Doe');
        
        // Initially, actions should not be visible
        expect(screen.queryByTestId('friend-actions')).not.toBeInTheDocument();
        
        // Click to show actions
        fireEvent.click(nameElement);
        expect(screen.getByTestId('friend-actions')).toBeInTheDocument();
        
        // Click again to hide actions
        fireEvent.click(nameElement);
        expect(screen.queryByTestId('friend-actions')).not.toBeInTheDocument();
    });
     */
});
