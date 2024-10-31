import '@testing-library/jest-dom';
import {render} from "@testing-library/react";
import React from "react";
import {MessageTimestamp} from "@/components/MessageTimestamp";

describe('MessageTimestamp renders with correct content,', () => {
    test("basic date time string", ()=>{
        const {getByText} = render(<MessageTimestamp unixTimestamp={1695663006000} />);
        const component = getByText("Sent 9/25/2023, 10:30 am")
        expect(component).toBeInTheDocument();
    });

    test("same day, different time", ()=>{
        const {getByText} = render(<MessageTimestamp unixTimestamp={1695663246000} />);
        const component = getByText("Sent 9/25/2023, 10:34 am")
        expect(component).toBeInTheDocument();
    });

    test("change in month", ()=>{
        const {getByText} = render(<MessageTimestamp unixTimestamp={1703514306000} />);
        const component = getByText("Sent 12/25/2023, 6:25 am")
        expect(component).toBeInTheDocument();
    });

    test("pm data set", ()=>{
        const {getByText} = render(<MessageTimestamp unixTimestamp={1703535486000} />);
        const component = getByText("Sent 12/25/2023, 12:18 pm")
        expect(component).toBeInTheDocument();
    });

    test("post midnight test", ()=>{
        const {getByText} = render(<MessageTimestamp unixTimestamp={1702888386000} />);
        const component = getByText("Sent 12/18/2023, 12:33 am")
        expect(component).toBeInTheDocument();
    });

    test("second pm test", ()=>{
        const {getByText} = render(<MessageTimestamp unixTimestamp={1730343366000} />);
        const component = getByText("Sent 10/30/2024, 7:56 pm")
        expect(component).toBeInTheDocument();
    });

    test("Add case for leading zeroes", ()=>{
        const {getByText} = render(<MessageTimestamp unixTimestamp={1702886946000} />);
        const component = getByText("Sent 12/18/2023, 12:09 am")
        expect(component).toBeInTheDocument();
    });
});

