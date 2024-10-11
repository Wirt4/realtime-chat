import '@testing-library/jest-dom'
import NavbarListItem from "@/app/(dashboard)/navbarlistitem"
import {render, screen} from "@testing-library/react";
describe('NavBarListItem', () => {
    beforeEach(()=>{
        render(<NavbarListItem />);
    })
    test('make sure component as list item',()=>{
        const listItem = screen.getByRole('listitem');
        expect(listItem).toBeInTheDocument();
    });

    test('make sure component contains Link',()=>{
        const link = screen.getByRole('link')
        expect(link).toBeInTheDocument();
    });
});