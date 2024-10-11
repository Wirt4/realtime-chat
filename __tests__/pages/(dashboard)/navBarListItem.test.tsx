import '@testing-library/jest-dom'
import NavbarListItem from "@/app/(dashboard)/navbarlistitem"
import {render, screen} from "@testing-library/react";

describe('NavBarListItem', () => {
    test('make sure component as list item',()=>{
        render(<NavbarListItem href="foo"/>);
        const listItem = screen.getByRole('listitem');
        expect(listItem).toBeInTheDocument();
    });

    test('make sure component contains Link',()=>{
        render(<NavbarListItem href="foo"/>);
        const link = screen.getByRole('link')
        expect(link).toBeInTheDocument();
    });

    test('make sure link used desired href',()=>{
        render(<NavbarListItem href="/contact"/>);
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/contact');
    });
    test('make sure link used desired href',()=>{
        render(<NavbarListItem href="/add"/>);
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/add');
    });
});