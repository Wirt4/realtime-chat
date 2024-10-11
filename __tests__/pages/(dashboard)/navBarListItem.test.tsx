import '@testing-library/jest-dom'
import NavbarListItem from "@/app/(dashboard)/navbarlistitem"
import {render, screen} from "@testing-library/react";
describe('NavBarListItem', () => {
    test('make sure component as list item',()=>{
        render(<NavbarListItem />);
        const listItem = screen.getByRole('listitem');
        expect(listItem).toBeInTheDocument();
    });
    test('make sure component contains Link',()=>{
        render(<NavbarListItem />);
        const link = screen.getByRole('link')
        expect(link).toBeInTheDocument();
    });
});