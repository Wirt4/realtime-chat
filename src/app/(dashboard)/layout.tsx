import React, { ReactNode} from "react";
import MyGetServerSession from "@/lib/myGetServerSession";
import {notFound} from "next/navigation";
import Link from "next/link";

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
        <Link href="/dashboard"></Link>
        {children}
    </div>;
}

export default Layout;
