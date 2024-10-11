import React, { ReactNode} from "react";
import MyGetServerSession from "@/lib/myGetServerSession";
import {notFound} from "next/navigation";
import Link from "next/link";
import {Icons, Icon} from "@/components/Icons";
import NavbarListItem, {navbarListItemProps} from "@/app/(dashboard)/navbarlistitem";

interface LayoutProps {
    children: ReactNode
}

const options:navbarListItemProps[] = [{
    id: 1,
    name:'Add a Friend',
    Icon: 'UserPlus',
    href: '/dashboard/add',
},
    {
        id: 1,
        name:'Add a Friend',
        Icon: 'Logo',
        href: '/dashboard/add',
    }
]

const Layout = async ({children}: LayoutProps)=>{
    const session = await MyGetServerSession();
    if (!session){
        notFound();
    }
    return <div className='w-full flex h-screen'>
        <div className='flex h-full w-full max-w-xs frow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6'>
        <Link href="/dashboard" className='flex h-16 shrink-0 items-center'>
           <Icons.Logo className='h-20 w-auto text-indigo-600'/>
        </Link>
        <div className='text-xs font-semibold leading-6 text-gray-400'>Your Chats</div>
            <nav className='flex-1 flex flex-col'>
                <ul role='list' className='flex flex-1 flex-col gap-y-7'>
                    <li>
                      //chats the user has
                    </li>
                    <div className='text-xs font-semibold leading-6 text-gray-400'>Overview</div>
                    <ul role='list' className='-mx-2 mt-2 space-y-1'>
                        {options.map((option)=>{
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
