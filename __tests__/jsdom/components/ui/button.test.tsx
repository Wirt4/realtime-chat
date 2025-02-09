import Button from "@/components/ui/button/Button";
import { render } from "@testing-library/react";
import '@testing-library/jest-dom';

describe('Button', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Button type test', () => {
        const { container } = render(<Button/>);
        const button = container.querySelector('button');
        expect(button?.type).toEqual('submit');
    });

    test('Miscellaneous props passed to React Parent', () => {
        const { container } = render(<Button color="#841584" />);
        const button = container.querySelector('button');
        expect(button?.getAttribute('color')).toEqual("#841584");
    });

    test('Miscellaneous props passed to React Parent', () => {
        const { container } = render(<Button />);
        const button = container.querySelector('button');
        expect(button).not.toHaveAttribute('color', "#841584");
    });

    test('if isLoading is false, then disabled is false', () => {
        const { container } = render(<Button isLoading={false} />);
        const button = container.querySelector('button');
        expect(button?.disabled).toEqual(false);
    });

    test('if isLoading is true, then disabled is true', () => {
        const { container } = render(<Button isLoading={true} />);
        const button = container.querySelector('button');
        expect(button?.disabled).toEqual(true);
    });

    test('if isLoading is false, then do not expect a Loader2 icon to be rendered', () => {
        const { container } = render(<Button isLoading={false} />);
        const loader = container.querySelector('svg');
        expect(loader).not.toBeInTheDocument();
    });

    test('if isLoading is true, then expect a Loader2 icon to be rendered', () => {
        const { container } = render(<Button isLoading={true} />);
        const loader = container.querySelector('svg');
        expect(loader).toBeInTheDocument();
    });

    test('The children field of the argument should be rendered in the final button', () => {
        const { getByText } = render(<Button isLoading={true}>TK421, why aren't you at your post?</Button>);
        expect(getByText("TK421, why aren't you at your post?")).toBeInTheDocument();
    });

    test('The children field of the argument should be rendered in the final button, different data', () => {
        const { getByText } = render(<Button isLoading={true}>Boring conversation anyway</Button>);
        expect(getByText("Boring conversation anyway")).toBeInTheDocument();
    });
});
