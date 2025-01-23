import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ChatImage from '@/components/Sidebar/ChatImage/component';
import { ChatImageProps } from '@/components/Sidebar/ChatImage/interface';
import { notFound } from "next/navigation";

jest.mock("next/navigation", () => ({
    __esModule: true,
    notFound: jest.fn()
}));


const mockParticipants: User[] = [
    { id: '1', name: 'Alice', email: 'alice@example.com', image: '/images/alice.png' },
    { id: '2', name: 'Bob', email: 'bob@example.com', image: '/images/bob.png' },
];

const renderComponent = (props: Partial<ChatImageProps> = {}) => {
    const defaultProps: ChatImageProps = {
        participantInfo: mockParticipants,
        chatId: 'chat-id',
        sessionId: '1',
        size: 32,
        ...props,
    };
    return render(<ChatImage {...defaultProps} />);
};

describe('ChatImage', () => {
    test('renders the correct image for the other participant', () => {
        renderComponent();
        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('src', expect.stringContaining("bob.png"));
        expect(image).toHaveAttribute('alt', 'chat-id');
        expect(image).toHaveAttribute('width', '32');
        expect(image).toHaveAttribute('height', '32');
    });

    test('renders the correct image when sessionId matches the second participant', () => {
        renderComponent({ sessionId: '2' });
        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('src', expect.stringContaining("alice.png"));
        expect(image).toHaveAttribute('alt', 'chat-id');
        expect(image).toHaveAttribute('width', '32');
        expect(image).toHaveAttribute('height', '32');
    });

    test('renders notFound when  sessionId does not match any participant', () => {
        renderComponent({ sessionId: '3' });
        expect(notFound).toHaveBeenCalledTimes(1);
    });
});
