import '@testing-library/jest-dom';
import {fireEvent, render} from '@testing-library/react';
import ChatInput from '@/components/ChatInput/ChatInput';
import {useState} from "react";
import Helpers from "@/components/ChatInput/helpers/class/helpers";

jest.mock('react', ()=>({
    ...jest.requireActual('react'),
    useState: jest.fn()
}));

const mockUseState = (inputValue: string, isLoading: boolean) => {
    let count = 0;
    (useState as jest.Mock).mockImplementation(() => {
        if (count === 0) {
            count++;
            return [inputValue, jest.fn()];
        }
        return [isLoading, jest.fn()];
    });
};

const partner: User = {
    name: 'stub',
    email: 'stub',
    image: 'stub',
    id: 'stub'
};

describe('ChatInput Component displays', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        mockUseState('', false);
    });

    test('renders the TextareaAutosize component', () => {
        const {getByLabelText} = render(<ChatInput chatPartner={partner} chatId='stub' />);
        expect(getByLabelText('autosize field' as any)).toBeInTheDocument();
    });

    test('TextareaAutosize component has the correct aria-label', () => {
        const {getByLabelText} = render(<ChatInput chatPartner={partner} chatId='stub' />);
        const textArea = getByLabelText('autosize field' as any);
        expect(textArea).toBeInTheDocument();
        expect(textArea).toHaveAttribute('aria-label', 'autosize field');
    });

    test('TextareaAutosize component generates with the placeholder text', () => {
        mockUseState('Hello Batman', false);
        const {getByLabelText} = render(<ChatInput chatPartner={partner} chatId='stub' />);
        const textArea = getByLabelText('autosize field' as any);
        expect(textArea).toHaveValue('Hello Batman');
    });

    test('TextareaAutosize component generates with the correct text, Different Data', () => {
        mockUseState('Hello Alfred', false);
        const {getByLabelText} = render(<ChatInput chatPartner={partner} chatId='stub' />);
        const textArea = getByLabelText('autosize field' as any);
        expect(textArea).toHaveValue('Hello Alfred');
    });

    test('TextareaAutosize component generates with the correct number of rows', () => {
        const {getByLabelText} = render(<ChatInput chatPartner={partner} chatId='stub' />);
        const textArea = getByLabelText('autosize field' as any);
        expect(textArea).toHaveAttribute('rows', '1');
    });

    test('Placeholder text should include the name of your chat partner', () => {
        const customPartner = {...partner, name: 'Alvin'};
        const {getByLabelText} = render(<ChatInput chatPartner={customPartner} chatId='stub' />);
        const textArea = getByLabelText('autosize field' as any);
        expect(textArea).toHaveAttribute('placeholder', 'Send Alvin a message');
    });

    test('Placeholder text should include the name of your chat partner, different data', () => {
        const customPartner = {...partner, name: 'Simon'};
        const {getByLabelText} = render(<ChatInput chatPartner={customPartner} chatId='stub' />);
        const textArea = getByLabelText('autosize field' as any);
        expect(textArea).toHaveAttribute('placeholder', 'Send Simon a message');
    });

    test('Component should display a Button', () => {
        const {getByRole} = render(<ChatInput chatPartner={partner} chatId='stub' />);
        const buttonElement = getByRole('button' as any);
        expect(buttonElement).toBeInTheDocument();
    });
});

describe('ChatInput inner logic', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        mockUseState('', false);
    });

    test('input is set with text from change event, different data', () => {
        const setInputMock = jest.fn();
        (useState as jest.Mock).mockImplementation(() => ['', setInputMock]);

        const {getByLabelText} = render(<ChatInput chatPartner={partner} chatId='stub' />);
        const textArea = getByLabelText('autosize field' as any);
        fireEvent.change(textArea, {target: {value: 'Bonjour'}});

        expect(setInputMock).toHaveBeenCalledWith('Bonjour');
    });

    test('input is set with text from change event', () => {
        const setInputMock = jest.fn();
        (useState as jest.Mock).mockImplementation(() => ['', setInputMock]);

        const {getByLabelText} = render(<ChatInput chatPartner={partner} chatId='stub' />);
        const textArea = getByLabelText('autosize field' as any);
        fireEvent.change(textArea, {target: {value: 'Hello Clarice'}});

        expect(setInputMock).toHaveBeenCalledWith('Hello Clarice');
    });

    test('If change does not occur, do not change state', () => {
        const setInputMock = jest.fn();
        (useState as jest.Mock).mockImplementation(() => ['', setInputMock]);

        render(<ChatInput chatPartner={partner} chatId='stub' />);

        expect(setInputMock).not.toHaveBeenCalled();
    });

    test('If button is clicked, call helpers.SendMessage', () => {
        const SendMessageSpy = jest.spyOn(Helpers.prototype, 'SendMessage');
        const {getByRole} = render(<ChatInput chatPartner={partner} chatId='stub' />);
        const buttonElement = getByRole('button' as any);
        fireEvent.click(buttonElement);
        expect(SendMessageSpy).toHaveBeenCalled();
    });

    test('If button is not clicked, do not call helpers.SendMessage', () => {
        const SendMessageSpy = jest.spyOn(Helpers.prototype, 'SendMessage');
        render(<ChatInput chatPartner={partner} chatId='stub' />);
        expect(SendMessageSpy).not.toHaveBeenCalled();
    });
});
