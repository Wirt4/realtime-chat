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

    test('Contains a picture of the Dev', async () => {
        const { getByAltText } = await render(<Login />);

        const image = getByAltText("Wirt Salthouse");

        expect(image).toHaveAttribute('src', expect.stringContaining('wirt_salthouse.jpg'))
    });

    test('renders the heading', () => {
        const {getByRole} = render(<Login />);

        const heading = getByRole('heading', { name: "Wirt's Realtime Chat" });

        expect(heading).toBeInTheDocument();
    });

    test('Contains a link to the github page', () => {
        const {getByRole} = render(<Login />);

        const linkElement = getByRole('link', { name: /Github/i });

        expect(linkElement).toBeInTheDocument();
    });
})

