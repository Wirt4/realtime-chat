import React, { ReactNode} from "react";
import MyGetServerSession from "@/lib/myGetServerSession";
import {notFound} from "next/navigation";
import Link from "next/link";
import {Icons} from "@/components/Icons";

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
        <Link href="/dashboard" className='flex h-16 shrink-0 items-center'>
           <Icons.Logo className='h-20 w-auto text-indigo-600'/>
        </Link>
        {children}
    </div>;
}

export default Layout;
