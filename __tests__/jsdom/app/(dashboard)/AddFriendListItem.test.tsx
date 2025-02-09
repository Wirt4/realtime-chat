import '@testing-library/jest-dom'
import AddFriendListItem from "@/components/Sidebar/AddFriendListItem/addFriendListItem"
import { render, screen } from "@testing-library/react";

describe('Add A Friend', () => {
    test('make sure component contains Link', () => {
        const { getByRole } = render(<AddFriendListItem />);
        const link = getByRole('link')
        expect(link).toBeInTheDocument();
    });

    test('make sure link used desired href', () => {
        const { getByRole } = render(<AddFriendListItem />);
        const link = getByRole('link');
        expect(link).toHaveAttribute('href', '/dashboard/add');
    });

    test('confirm the logo is rendered', () => {
        render(<AddFriendListItem />);
        const icon = screen.getByLabelText('add-user-icon');
        expect(icon).toBeInTheDocument();
    });

    test('component should display the correct name', () => {
        render(<AddFriendListItem />);
        const userPlusIcon = screen.getByText('Add a Friend');
        expect(userPlusIcon).toBeInTheDocument();
    });
});
