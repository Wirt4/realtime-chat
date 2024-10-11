import '@testing-library/jest-dom'
import NavbarListItem from "@/app/(dashboard)/navbarlistitem"
import {render, screen} from "@testing-library/react";

describe('NavBarListItem', () => {
    test('make sure component as list item',()=>{
        render(<NavbarListItem href="foo" Icon="Logo"/>);
        const listItem = screen.getByRole('listitem');
        expect(listItem).toBeInTheDocument();
    });

    test('make sure component contains Link',()=>{
        render(<NavbarListItem href="foo"/>);
        const link = screen.getByRole('link')
        expect(link).toBeInTheDocument();
    });

    test('make sure link used desired href',()=>{
        render(<NavbarListItem href="/contact" Icon="Logo"/> );
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/contact');
    });

    test('make sure link used desired href',()=>{
        render(<NavbarListItem href="/add" Icon="Logo"/>);
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/add');
    });

    test('confirm the element is rendered',()=>{
        render(<NavbarListItem href="/add" Icon="Logo"/>);
        const logo = screen.getByTestId('logo-component');
        expect(logo).toBeInTheDocument();
    });

    test('confirm the UserPlus element is rendered',()=>{
        render(<NavbarListItem href="/add"Icon="MyUserPlus"/>);
        const logo = screen.getByTestId('userplus-component');
        expect(logo).toBeInTheDocument();
    });
});