import '@testing-library/jest-dom';
import {render} from "@testing-library/react";
import React from "react";
import {MessageTimestamp} from "@/components/MessageTimestamp";

describe('MessageTimestamp renders with correct content', () => {
    test('timestamp should render with text "message generated at:..."', ()=>{
        const {getByText} = render(<MessageTimestamp unixTimestamp={69} />);
        const component = getByText(/Message sent at: /i)
        expect(component).toBeInTheDocument();
    })
})
