import '@testing-library/jest-dom';
import {render,} from '@testing-library/react';
import ChatInput from '@/components/ChatInput/ChatInput';

describe('ChatInput Component displays', () => {
    test('renders the TextareaAutosize component', () => {
        const {getByLabelText} = render(<ChatInput />);
        expect(getByLabelText('autosize field')).toBeInTheDocument();
    });

    test('TextareaAutosize component has the correct aria-label', () => {
        const {getByLabelText} = render(<ChatInput />);
        const textArea = getByLabelText('autosize field');
        expect(textArea).toBeInTheDocument();
        expect(textArea).toHaveAttribute('aria-label', 'autosize field');
    });

    test('TextareaAutosize component generates with the correct placeholder text', () => {
        const {getByLabelText} = render(<ChatInput />);
        const textArea = getByLabelText('autosize field');
        expect(textArea).toBeInTheDocument();
        expect(textArea).toHaveAttribute('placeholder', 'Message Batman');
    });
    test('TextareaAutosize component generates with the correct placeholder text, Different Data', () => {
        const {getByLabelText} = render(<ChatInput />);
        const textArea = getByLabelText('autosize field');
        expect(textArea).toBeInTheDocument();
        expect(textArea).toHaveAttribute('placeholder', 'Message Alfred');
    });
});
