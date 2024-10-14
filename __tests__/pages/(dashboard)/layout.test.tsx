import '@testing-library/jest-dom'
import Layout from "@/app/(dashboard)/layout"
import myGetServerSession from "@/lib/myGetServerSession";
import {ReactNode} from "react";
import {notFound} from "next/navigation"
import fetchRedis from "@/helpers/redis";

jest.mock("../../../src/lib/myGetServerSession",()=>({
    __esModule: true,
    default: jest.fn()
}));

jest.mock("next/navigation", () => ({
    __esModule: true,
    notFound: jest.fn()
}));

jest.mock("../../../src/helpers/redis", ()=>({
    __esModule: true,
    default: jest.fn()
}))

describe('Layout tests',()=>{
    beforeEach(()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue({user:{id: 'foo'}});
    })
    afterEach(()=>{
        jest.resetAllMocks();
    });

    test('renders without crashing',async ()=>{
        try{
            await Layout({});
        }catch(error){
            console.error(error);
            expect(true).toEqual(false);
        }
    });

    test('renders children',async ()=>{
        const testNode = <div>Tossed Salads and Scrambled eggs</div> as ReactNode
        const layout = await Layout({children:testNode});
        expect(layout.props.children).toEqual(
            expect.arrayContaining(
                [expect.objectContaining({props:
                        expect.objectContaining({children:'Tossed Salads and Scrambled eggs'})
                })]));
    });

    test('should call a server session',async ()=>{
        await Layout({});
        expect(myGetServerSession).toHaveBeenCalledTimes(1);
    });

    test("if it a bad session, then the layout should be notFound",async ()=>{
        (myGetServerSession as jest.Mock).mockResolvedValue(null);
        await Layout({});
        expect(notFound).toHaveBeenCalledTimes(1);
    });

    test("If it's a fine session, then  notFound should not be called",async ()=>{
        await Layout({});
        expect(notFound).not.toHaveBeenCalled();
    });

    test("needs to include a Link to dashboard",async ()=>{
        const layout = await Layout({});
        expect(layout.props.children).toEqual(
            expect.arrayContaining([
                expect.objectContaining({props:
                        expect.objectContaining({children:
                                expect.arrayContaining([
                                    expect.objectContaining({props:
                                            expect.objectContaining({href: '/dashboard'})})])})})]))
    })

    test('Sidebar needs a div called "Your Chats"', async ()=> {
        const layout = await Layout({});
        expect(layout.props.children).toEqual(
            expect.arrayContaining([
                expect.objectContaining({props:
                        expect.objectContaining({children:
                                expect.arrayContaining([
                                    expect.objectContaining({props:
                                            expect.objectContaining({children: 'Your Chats'})})])})})]));
    });
    test('Sidebar  a nav for existing chats', async ()=> {
        const layout = await Layout({});
        expect(layout.props.children).toEqual(
            expect.arrayContaining([
                expect.objectContaining({props:
                        expect.objectContaining({children:
                                expect.arrayContaining([
                                    expect.objectContaining({type: 'nav'})])})})]))
    });
    test('Output of fetchRedis is passed to child component of FriendRequestSidebarOptions.initialRequestCount',()=>{

    })
});
