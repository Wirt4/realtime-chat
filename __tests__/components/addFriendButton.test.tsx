
import '@testing-library/jest-dom'
import {render, screen, fireEvent} from '@testing-library/react'
import AddFriendButton from "@/components/AddFriendButton"
import {Utils} from "@/lib/utils";
import { act } from 'react'
jest.mock('../../src/lib/utils', () => ({
    Utils: {
        addFriend: jest.fn(),
        buttonClassNames: jest.fn().mockReturnValue('mocked-classes')
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
})

describe('addFriendButton events',()=>{
    test('when the button is clicked, the addFriend method is called', async ()=>{
        const spy = jest.spyOn(Utils, 'addFriend').mockImplementation(jest.fn())
        render(<AddFriendButton/>)
        const emailInput = screen.getByPlaceholderText('you@example.com');
        const buttonElement = screen.getByRole('button', { name: /add/i });

        await act(async () => {
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.click(buttonElement)
        })

        expect(spy).toHaveBeenCalled()
    })
})
