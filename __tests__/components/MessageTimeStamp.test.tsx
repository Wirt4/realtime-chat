import '@testing-library/jest-dom';
import {render} from "@testing-library/react";
import React from "react";
import {MessageTimestamp} from "@/components/MessageTimestamp";

describe('MessageTimestamp renders with correct content', () => {
    beforeAll(()=>{
        jest.useFakeTimers()
    })
    afterAll(()=>{
        jest.useRealTimers()
    })
    test('timestamp should render with text "message generated at:..."', ()=>{
        const {getByText} = render(<MessageTimestamp unixTimestamp={1695663006000} />);
        const component = getByText(/Message sent at: /i)
        expect(component).toBeInTheDocument();
    })

    test("If it's the same day, only display the time the message was sent", ()=>{
        jest.setSystemTime(1695666606000)
        const {getByText} = render(<MessageTimestamp unixTimestamp={1695663006000} />);
        const component = getByText(/Message sent at: 10:30 am/i)
        expect(component).toBeInTheDocument();
    })

    test("If it's the same day, only display the time the message was sent, different data", ()=>{
        jest.setSystemTime(1695666606000)
        const {getByText} = render(<MessageTimestamp unixTimestamp={1695663246000} />);
        const component = getByText(/Message sent at: 10:34 am/i)
        expect(component).toBeInTheDocument();
    })
})
