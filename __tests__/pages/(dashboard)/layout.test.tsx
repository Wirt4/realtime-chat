import '@testing-library/jest-dom'
import Layout from "@/app/(dashboard)/layout"
import myGetServerSession from "@/lib/myGetServerSession";
import {ReactNode} from "react";
jest.mock("../../../src/lib/myGetServerSession",()=>({
    __esModule: true,
    default: jest.fn()
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

});
