import { render, screen } from '@testing-library/react';
import Login from '@/components/ui/login/Login';
import '@testing-library/jest-dom'
import {Utils} from "@/lib/utils";

describe('Login Component', () => {
    afterAll(()=>{
        jest.restoreAllMocks()
    })
    test('renders the login page', () => {
        jest.spyOn(Utils, 'loginWithGoogle').mockImplementation(jest.fn())
        render(<Login />);

        // Check if the sign-in heading is rendered
        expect(screen.getByText('Sign in with Google')).toBeInTheDocument();

        // Check if the Google button is rendered
        const googleButton = screen.getByText('Google');
        expect(googleButton).toBeInTheDocument();
    })
})
