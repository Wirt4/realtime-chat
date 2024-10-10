import { ReactNode} from "react";
import MyGetServerSession from "@/lib/myGetServerSession";
import {notFound} from "next/navigation";

interface LayoutProps {
    children: ReactNode
}

const Layout = async ({children}: LayoutProps)=>{
    const session = await MyGetServerSession();
    if (!session){
        notFound();
    }
    return <div className='w-full flex h-screen'>
        <div className='flex h-full w-full max-w-xs frow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6'></div>
        {children}
    </div>;
}

export default Layout;
