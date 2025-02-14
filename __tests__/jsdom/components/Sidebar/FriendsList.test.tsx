import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import FriendsList from '@/components/Sidebar/FriendsList/component';
import { FriendInfo } from '@/components/Sidebar/FriendListItem/interface';


//jest.mock('./FriendItem', () => jest.fn(() => <li data-testid="friend-item" />));

describe('FriendList', () => {
    const friends: FriendInfo[] = [
        { id: '1', name: 'Charlie' },
        { id: '2', name: 'Alice' },
        { id: '3', name: 'Bob' }
    ];

    it('renders the list of friends', () => {
        render(<FriendsList friends={friends} />);

        expect(screen.getAllByTestId('friend-item')).toHaveLength(3);
    });

    /* it('sorts friends alphabetically by name', () => {
         render(<FriendList friends={friends} />);
         
         const friendItems = screen.getAllByTestId('friend-item');
         
         expect(FriendItem).toHaveBeenCalledWith(
             { friend: { id: '2', name: 'Alice' } },
             {}
         );
         expect(FriendItem).toHaveBeenCalledWith(
             { friend: { id: '3', name: 'Bob' } },
             {}
         );
         expect(FriendItem).toHaveBeenCalledWith(
             { friend: { id: '1', name: 'Charlie' } },
             {}
         );
     });
 
     it('renders correctly with an empty friends list', () => {
         render(<FriendList friends={[]} />);
         
         expect(screen.queryByTestId('friend-item')).not.toBeInTheDocument();
     });*/
});
