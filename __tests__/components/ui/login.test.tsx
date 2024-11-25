import '@testing-library/jest-dom'
import { render } from '@testing-library/react';
import Login from '@/components/ui/login/Login';

describe('Login Component', () => {
    afterAll(()=>{
        jest.restoreAllMocks()
    })
    test('renders the login page', () => {
        const {getByText} = render(<Login />);

        // Check if the sign-in heading is rendered
        const title = getByText("Sign in with Google")
        expect(title).toBeInTheDocument();
    })

    test('Renders the google button',()=>{
        const {getByText} = render(<Login />);
        const button = getByText('Google')
        expect(button).toBeInTheDocument();
    })

    test('uses correct src', async () => {
        const { getByAltText } = await render(<Login />);

        const image = getByAltText("Wirt Salthouse");

        expect(image).toHaveAttribute('src', expect.stringContaining('assets/jpgs/wirt_salthouse.jpg'.replaceAll("/","%2F")))
    });
})
