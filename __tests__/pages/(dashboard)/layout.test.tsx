import '@testing-library/jest-dom'
import {render} from '@testing-library/react'
import Layout from "@/app/(dashboard)/layout"
describe('Layout tests',()=>{
    test('renders without crashing',()=>{
        render(<Layout/>);
    });
});
