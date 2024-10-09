
import '@testing-library/jest-dom'
import {render, screen, fireEvent} from '@testing-library/react'
import AddFriendButton from "@/components/AddFriendButton"

const mockHandleSubmit = jest.fn();
jest.mock("../../src/lib/submissions.ts", () => {
    return {
        Submissions: jest.fn().mockImplementation(() => {
            return {
                handleSubmit: mockHandleSubmit,
            }
        }),
    }
})

describe('addFriendButton', () => {
    beforeEach(()=>{
        render(<AddFriendButton />)
    })
    afterEach(()=>{
        mockHandleSubmit.mockReset()
    })

   test('expect label to be rendered correctly',()=>{
       expect(screen.getByText('Add a Friend by Email:')).toBeInTheDocument();
   })
    test('expect button to be in the form',()=>{
        const buttonElement = screen.getByRole('button', { name: /add/i });
        expect(buttonElement).toBeInTheDocument();
    })

   test('When submit button is clicked, the Submissions Handle submit method should be called', async ()=>{
       const addButton = screen.getByRole("form");
       fireEvent.submit(addButton);
       expect(mockHandleSubmit).toHaveBeenCalled();
    })

    test('When submit button is clicked, handleSubmit receives setSuccess as an argument', () => {
        const formElement = screen.getByRole('form');
        fireEvent.submit(formElement);
        expect(mockHandleSubmit).toHaveBeenCalledWith(expect.any(Function));
    });
})
