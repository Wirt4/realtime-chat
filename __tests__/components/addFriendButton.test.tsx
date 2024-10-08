
import '@testing-library/jest-dom'
import {render, screen} from '@testing-library/react'
import AddFriendButton from "@/components/AddFriendButton"


describe('addFriendButton', () => {
    beforeEach(()=>{
        render(<AddFriendButton />)
    })
   test('expect label to be rendered correctly',()=>{
       expect(screen.getByText('Add a Friend by Email:')).toBeInTheDocument();
   })
    test('expect button to be in the form',()=>{
        const buttonElement = screen.getByRole('button', { name: /add/i });
        expect(buttonElement).toBeInTheDocument();
    })
})