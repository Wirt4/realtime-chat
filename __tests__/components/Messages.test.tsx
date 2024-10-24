import '@testing-library/jest-dom';
import {render} from "@testing-library/react";
import Messages from "@/components/Messages";

describe('Messages renders with correct components', () => {
    test('renders with a div labeled "messages"', () => {
        const {getByLabelText} = render(<Messages/>)
        const div = getByLabelText('messages')
        expect(div).toBeInTheDocument();
    })
})
