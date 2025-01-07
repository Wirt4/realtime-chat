import '@testing-library/jest-dom';
import {fireEvent, render,} from '@testing-library/react';
import ChatInput from '@/components/ChatInput/ChatInput';
import {useState} from "react";
import Helpers from "@/components/ChatInput/helpers";

jest.mock('react', ()=>({
    ...jest.requireActual('react'),
    useState: jest.fn()
}));

describe('ChatInput Component displays', () => {
    let partner: User
    beforeEach(()=>{
        jest.resetAllMocks();
        let count = 0;
        (useState as jest.Mock).mockImplementation(()=>{
            if (count == 0){
                count ++;
                return ['', jest.fn()]
            }
            return [false, jest.fn()];
        });
        partner  = {
            name: 'stub',
            email: 'stub',
            image: 'stub',
            id: 'stub'
        }
    });

    test('renders the TextareaAutosize component', () => {
        const {getByLabelText} = render(<ChatInput chatPartner={partner}  chatId='stub' />);
        expect(getByLabelText('autosize field')).toBeInTheDocument();
    });

    test('TextareaAutosize component has the correct aria-label', () => {
        const {getByLabelText} = render(<ChatInput chatPartner={partner} chatId='stub'  />);
        const textArea = getByLabelText('autosize field');
        expect(textArea).toBeInTheDocument();
        expect(textArea).toHaveAttribute('aria-label', 'autosize field');
    });

    test('TextareaAutosize component generates with the placeholder text', () => {
        let count = 0;
        (useState as jest.Mock).mockImplementation(()=>{
            if (count == 0){
                count ++;
                return ['Hello Batman', jest.fn()]
            }
            return [false, jest.fn()];
        });

        const {getByLabelText} = render(<ChatInput chatPartner={partner}  chatId='stub' />);
        const textArea = getByLabelText('autosize field');
        expect(textArea).toHaveValue('Hello Batman');
    });

    test('TextareaAutosize component generates with the correct text, Different Data', () => {
        let count = 0;
        (useState as jest.Mock).mockImplementation(()=>{
            if (count == 0){
                count ++;
                return ['Hello Alfred', jest.fn()]
            }
            return [false, jest.fn()];
        });

        const {getByLabelText} = render(<ChatInput chatPartner={partner} chatId='stub'  />);
        const textArea = getByLabelText('autosize field');
        expect(textArea).toHaveValue('Hello Alfred');
    });

    test('TextareaAutosize component generates with the correct number of rows', () => {
        const {getByLabelText} = render(<ChatInput chatPartner={partner}  chatId='stub' />);
        const textArea = getByLabelText('autosize field');
        expect(textArea).toHaveAttribute('rows', '1');
    });

    test('Placeholder text should include the name of your chat partner', () => {
         partner= {
            name: 'Alvin',
            email: 'alvin@chipmunk.com',
            image: 'stub',
            id: 'stub'
        }

        const {getByLabelText} = render(<ChatInput chatPartner={partner}  chatId='stub' />);
        const textArea = getByLabelText('autosize field');

        expect(textArea).toHaveAttribute('placeholder', 'Send Alvin a message');
    });

    test('Placeholder text should include the name of your chat partner, different data', () => {
         partner =  {
            name: 'Simon',
            email: 'simon@chipmunk.com',
            image: 'stub',
            id: 'stub'
        }

        const {getByLabelText} = render(<ChatInput chatPartner={partner}  chatId='stub' />);
        const textArea = getByLabelText('autosize field');

        expect(textArea).toHaveAttribute('placeholder', 'Send Simon a message');
    });

    test('Component should display a Button', ()=>{
        const {getByRole} = render(<ChatInput chatPartner={partner} chatId='stub'  />);
        const buttonElement = getByRole('button', { name: /Send/i });
        expect(buttonElement).toBeInTheDocument();
    })
});

describe('ChatInput inner logic', ()=>{
    let partner: User;
    beforeEach(()=>{
        jest.resetAllMocks();
        (useState as jest.Mock).mockImplementation(()=>{ return ['', jest.fn()]});
        partner  = {
            name: 'stub',
            email: 'stub',
            image: 'stub',
            id: 'stub'
        }
    });

    test('input is set with text from change event, different data', () => {
        const setInputMock = jest.fn();
        (useState as jest.Mock).mockImplementation(()=>{ return ['', setInputMock]});

        const {getByLabelText} = render(<ChatInput chatPartner={partner} chatId='stub' />);
        const textArea = getByLabelText('autosize field');
        fireEvent.change(textArea, { target: { value: 'Bonjour' } });

        expect(setInputMock).toHaveBeenCalledWith('Bonjour');
    });

    test('input is set with text from change event', () => {
        const setInputMock = jest.fn();
        (useState as jest.Mock).mockImplementation(()=>{ return ['', setInputMock]});

        const {getByLabelText} = render(<ChatInput chatPartner={partner}  chatId='stub'  />);
        const textArea = getByLabelText('autosize field');
        fireEvent.change(textArea, { target: { value: 'Hello Clarice' } });

        expect(setInputMock).toHaveBeenCalledWith('Hello Clarice');
    });

    test('If change does not occur, do not change state', () => {
        const setInputMock = jest.fn();
        (useState as jest.Mock).mockImplementation(()=>{ return ['', setInputMock]});

        render(<ChatInput chatPartner={partner} chatId='stub'  />);

        expect(setInputMock).not.toHaveBeenCalled();
    });

    test('If button is clicked, call helpers.SendMessage', () => {
        const SendMessageSpy = jest.spyOn(Helpers.prototype, 'SendMessage')
        const {getByRole} = render(<ChatInput chatPartner={partner}  chatId='stub'  />);
        const buttonElement = getByRole('button', { name: /Send/i });
        fireEvent.click(buttonElement);
        expect(SendMessageSpy).toHaveBeenCalled();
    })

    test('If button is  not clicked,  do not call helpers.SendMessage', () => {
        const SendMessageSpy = jest.spyOn(Helpers.prototype, 'SendMessage')
        render(<ChatInput chatPartner={partner}  chatId='stub'  />);

        expect(SendMessageSpy).not.toHaveBeenCalled();
    })
})
