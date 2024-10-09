
import '@testing-library/jest-dom'
import {render, screen, fireEvent} from '@testing-library/react'
import AddFriendButton from "@/components/AddFriendButton"
import {Submissions} from "@/lib/submissions"


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
        const spy = jest.spyOn(Submissions, 'handleSubmit').mockImplementation(jest.fn())
        const form = screen.getByRole('button', { name: /add/i })

        fireEvent.submit(form)

        expect(spy).toHaveBeenCalledTimes(1);
    })
})