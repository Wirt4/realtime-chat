
import '@testing-library/jest-dom'
import {render, screen, fireEvent} from '@testing-library/react'
import AddFriendButton from "@/components/AddFriendButton"
import {Submissions} from "@/lib/submissions"

jest.mock("../../src/lib/submissions.ts", () => ({
    Submissions: {
        handleSubmit: jest.fn(),
    },
}))

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

    test('When submit button is clicked, the Submissions Handle submit method should be called', async ()=>{
        const addButton = screen.getByText("Add");
        fireEvent.click(addButton)
        expect(Submissions.handleSubmit).toHaveBeenCalled()
    })
})
