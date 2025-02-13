import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FriendListItem from '@/components/Sidebar/FriendListItem/component';

jest.mock("@/components/Sidebar/FriendListItemAPIActions/component", () => jest.fn(() => <div data-testid="friend-actions" />));

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

    it('toggles FriendActions when the name is clicked', () => {
        render(<FriendListItem friend={friend} />);
        const nameElement = screen.getByText('John Doe');

        fireEvent.click(nameElement);

        expect(screen.getByTestId('friend-actions')).toBeInTheDocument();
    });

    it('toggles FriendActions back when the name is clicked', () => {
        render(<FriendListItem friend={friend} />);
        const nameElement = screen.getByText('John Doe');

        fireEvent.click(nameElement);
        fireEvent.click(nameElement);

        expect(screen.queryByTestId('friend-actions')).not.toBeInTheDocument();
    });
});
