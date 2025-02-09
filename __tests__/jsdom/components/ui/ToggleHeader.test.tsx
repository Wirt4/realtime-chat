import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ToggleHeader from '@/components/ui/toggleHeader/component';
import { ToggleHeaderProps } from '@/components/ui/toggleHeader/interface';

const renderComponent = (props: ToggleHeaderProps) => {
    return render(<ToggleHeader {...props} />);
};

describe('ToggleHeader', () => {
    test('renders the title when exists is true', () => {
        renderComponent({ title: 'Test Title', exists: true, className: 'test-class' });
        const header = screen.getByText('Test Title');
        expect(header).toBeInTheDocument();
        expect(header).toHaveClass('test-class');
    });

    test('does not render anything when exists is false', () => {
        renderComponent({ title: 'Test Title', exists: false, className: 'test-class' });
        const header = screen.queryByText('Test Title');
        expect(header).not.toBeInTheDocument();
    });
});
