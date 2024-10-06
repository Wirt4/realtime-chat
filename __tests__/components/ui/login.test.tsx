import { render, screen, fireEvent } from '@testing-library/react';
import Login from '@/components/ui/login/Login';
import '@testing-library/jest-dom'

describe('Login Component', () => {
    test('renders the login page', () => {
        render(<Login />);

        // Check if the sign-in heading is rendered
        expect(screen.getByText('Sign in with Google')).toBeInTheDocument();

        // Check if the Google button is rendered
        const googleButton = screen.getByText('Google');
        expect(googleButton).toBeInTheDocument();
    })
})
