import '@testing-library/jest-dom'
import {render, screen} from '@testing-library/react';
import Layout from "@/app/(dashboard)/layout"
import AddFriendButton from "@/components/AddFriendButton";
describe('Layout tests',()=>{
    test('renders without crashing',()=>{
        render(<Layout/>);
    });
    test('renders children',()=>{
        render(<Layout><AddFriendButton/></Layout>);
        expect(screen.getByText('Add a Friend by Email:')).toBeInTheDocument();
    })
});
