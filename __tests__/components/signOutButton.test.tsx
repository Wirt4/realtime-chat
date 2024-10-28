import '@testing-library/jest-dom';
import {render, fireEvent, waitFor} from "@testing-library/react";
import SignOutButton from "@/components/signOutButton";
import {signOut} from "next-auth/react";
import React from "react";
import { toast } from 'react-hot-toast'

jest.mock("next-auth/react",()=>({
    signOut: jest.fn()
}));

jest.mock('react-hot-toast', () => ({
    toast: {
        error: jest.fn(),
    }
}));

describe('SignOutButton', () => {
    let setIsLoading: jest.Mock;

    beforeAll(()=>{
        setIsLoading = jest.fn();
    });

    beforeEach(()=>{
        jest.spyOn(React, 'useState').mockImplementation(() => [false, setIsLoading]);
    });

    afterEach(()=>{
        jest.resetAllMocks();
    });

    test('Component renders',()=>{
        render(<SignOutButton/>);
    });

    test('If component is clicked, then signOut() is called',()=>{
        const {getByRole} = render(<SignOutButton/>);
        const button = getByRole('button');

        fireEvent.click(button);

        expect(signOut as jest.Mock).toHaveBeenCalled();
    });

    test('If component not loading,then the icon should be "log out"',()=>{
        const {queryByLabelText} = render(<SignOutButton/>);
        const icon = queryByLabelText('log out');

        expect (icon).toBeInTheDocument();
    });

    test('If component is loading,then the icon should be "loading"',()=>{
        jest.spyOn(React, 'useState').mockImplementation(() => [true, jest.fn()]);

        const {queryByLabelText} = render(<SignOutButton/>);
        const icon = queryByLabelText('loading');

        expect (icon).toBeInTheDocument();
    });

    test('If the button is clicked, then setIsLoading is called with true and finally false',()=>{
        const {getByRole} = render(<SignOutButton/>);
        const button = getByRole('button');

        fireEvent.click(button);

        waitFor(()=>{
            expect (setIsLoading.mock.calls).toEqual([[true], [false]]);
        });
    });

    test('if signOut throws, then "There was a problem logging out" is passed to toast.error',()=>{
        (signOut as jest.Mock).mockRejectedValue('Bad!');
        const{ getByRole}  = render(<SignOutButton/>);
        const button = getByRole('button');

        fireEvent.click(button);

        waitFor(()=>{
            expect(toast.error).toHaveBeenCalledWith("There was a problem logging out");
        });
    });

    test('If props passed to SignOutButton, then thet=y are passed to Button', () => {
        const { getByRole } = render(<SignOutButton value="grey" />);
        const button = getByRole('button');

        expect(button).toHaveAttribute('value', 'grey');
    });
});
