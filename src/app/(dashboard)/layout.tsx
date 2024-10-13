import React, { ReactNode} from "react";
import MyGetServerSession from "@/lib/myGetServerSession";
import {notFound} from "next/navigation";
import Link from "next/link";
import {Icons} from "@/components/Icons";
import NavbarListItem from "@/app/(dashboard)/navbarlistitem";
import layoutOptions from "@/app/(dashboard)/layoutOptions";

interface LayoutProps {
    children: ReactNode
}

const Layout = async ({children}: LayoutProps)=>{
    const session = await MyGetServerSession();
    if (!session){
        notFound();
    }

    return <div className='w-full flex h-screen'>
        <div className='flex h-full max-w-xs frow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white pt-6 px-6'>
        <Link href="/dashboard" className='flex h-16 shrink-0 items-center'>
           <Icons.Logo className='h-12 w-auto text-gray-400'/>
        </Link>
        <div className='text-xs font-semibold leading-6 text-gray-400'>
            Your Chats
        </div>
            <nav className='flex flex-1 flex-col'>
                <ul role='list' className='flex flex-1 flex-col gap-y-7'>
                    <li>
                      To Be Determined: Chats that the user has
                    </li>
                    <div className='text-xs font-semibold leading-6 text-gray-400'>Overview</div>
                    <ul role='list' className='-mx-2 mt-2 space-y-1'>
                        {layoutOptions.map((option)=>{
                            return <NavbarListItem key = {option.id}
                                                   Icon={option.Icon}
                                                   name = {option.name}
                                                   href={option.href}/>
                        })}
                    </ul>
                </ul>
            </nav>
        </div>
        {children}
    </div>;
}

export default Layout;
