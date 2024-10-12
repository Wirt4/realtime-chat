import {Icons} from '@/components/Icons'
import React from "react";

describe('Icons', ()=>{
    test ('should have a component called Logo',()=>{
        expect(Icons).toEqual(
            expect.objectContaining({Logo: expect.anything()}));
    });

    test ('Logo should be a function',()=>{
       expect(typeof Icons.Logo).toEqual('function');
    });

    test('Logo should return a react element', ()=>{
        const logo = Icons.Logo()
        expect(React.isValidElement(logo)).toBe(true);
    });

    test('should have a component called "AddUser"',()=>{
        expect(Icons).toEqual(
            expect.objectContaining({AddUser:expect.anything()}));
    });
});
