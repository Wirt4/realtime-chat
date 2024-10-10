import '@testing-library/jest-dom'
import Layout from "@/app/(dashboard)/layout"
import myGetServerSession from "@/lib/myGetServerSession";
import {ReactNode} from "react";
import {notFound} from "next/navigation"

jest.mock("../../../src/lib/myGetServerSession",()=>({
    __esModule: true,
    default: jest.fn()
}));

jest.mock("next/navigation", () => ({
    __esModule: true,
    notFound: jest.fn()
}));

describe('Layout tests',()=>{
    afterEach(()=>{
        jest.resetAllMocks();
    });

    test('renders without crashing',async ()=>{
        try{
            await Layout({});
        }catch(error){
            expect(true).toEqual(false);
        }
    });

    test('renders children',async ()=>{
        const testNode = <div>Tossed Salads and Scrambled eggs</div> as ReactNode
        const layout = await Layout({children:testNode});
        expect(layout.props.children.props.children).toEqual("Tossed Salads and Scrambled eggs");
    });

    test('should call a server session',async ()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: 'foo'}});
        await Layout({});
        expect(myGetServerSession).toHaveBeenCalledTimes(1);
    });

    test("if it a bad session, then the layout should be notFound",async ()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue(null);
        await Layout({});
        expect(notFound).toHaveBeenCalledTimes(1);
    });

    test("If it's a fine session, then  notFound should not be called",async ()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue({foo:"bar"});
        await Layout({});
        expect(notFound).not.toHaveBeenCalled();
    });
});
