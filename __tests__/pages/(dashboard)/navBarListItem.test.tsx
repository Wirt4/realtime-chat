import '@testing-library/jest-dom'
import NavbarListItem from "@/app/(dashboard)/navbarlistitem"
import {render, screen} from "@testing-library/react";

describe('NavBarListItem', () => {
    test('make sure component as list item',()=>{
        render(<NavbarListItem href="foo" Icon="Logo" name='Order an Main'/>);
        const listItem = screen.getByRole('listitem');
        expect(listItem).toBeInTheDocument();
    });

    test('make sure component contains Link',()=>{
        render(<NavbarListItem href="foo" Icon={"Logo"} name='Main'/>);
        const link = screen.getByRole('link')
        expect(link).toBeInTheDocument();
    });

    test('make sure link used desired href',()=>{
        render(<NavbarListItem href="/contact" Icon="Logo" name='Order an Aligator'/> );
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/contact');
    });

    test('make sure link used desired href',()=>{
        render(<NavbarListItem href="/add" Icon="Logo" name='Main'/>);
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/add');
    });

    test('confirm the element is rendered',()=>{
        render(<NavbarListItem href="/add" Icon="Logo" name='Main'/>);
        const logo = screen.getByLabelText('Logo');
        expect(logo).toBeInTheDocument();
    });

    test('confirm the UserPlus element is rendered',()=>{
        render(<NavbarListItem href="/add" Icon="UserPlus" name='Main'/>);
        const name = screen.getByLabelText('UserPlus');
        expect(name).toBeInTheDocument();
    });


    test('component should display the correct name',()=>{
        render(<NavbarListItem href="/add" Icon="UserPlus" name='Add a Friend'/>);
        const userPlusIcon = screen.getByText('Add a Friend');
        expect(userPlusIcon).toBeInTheDocument();
    });
    test('component should display the correct name Alternate Data',()=>{
        render(<NavbarListItem href="/add" Icon="Logo" name='Main' />);
        const userPlusIcon = screen.getByText('Main');
        expect(userPlusIcon).toBeInTheDocument();
    });
});
