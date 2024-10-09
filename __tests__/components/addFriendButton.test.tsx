
import '@testing-library/jest-dom'
import {render, screen} from '@testing-library/react'
import AddFriendButton from "@/components/AddFriendButton"

jest.mock("../../src/lib/submissions.ts", () => {
    return {
        Submissions: jest.fn().mockImplementation(() => {
            return {
                handleSubmit: jest.fn(),
            }
        }),
    }
})

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

   /** test('When submit button is clicked, the Submissions Handle submit method should be called', async ()=>{
        const addButton = screen.getByText("Add");
        fireEvent.click(addButton)
        expect(Submissions.handleSubmit).toHaveBeenCalled()
    })**/
})
