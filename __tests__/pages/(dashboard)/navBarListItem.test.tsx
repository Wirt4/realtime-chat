import '@testing-library/jest-dom'
import NavbarListItem from "@/app/(dashboard)/navbarlistitem"
import {render} from "@testing-library/react";
describe('NavBarListItem', () => {
    test('make sure component renders',()=>{
        render(<NavbarListItem />)
    })
})