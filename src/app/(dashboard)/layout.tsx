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
    return<div className='dashboard-window'>
        <div className='dashboard'>
        <Link href="/dashboard" className='dashboard-link'>
           <Icons.Logo className='dashboard-logo'/>
        </Link>
        <div className='dashboard-subheader'>
            Your Chats
        </div>
            <nav className='dashboard-nav-cols'>
                <ul role='list' className='dashboard-ul'>
                    <li>
                      TBD
                    </li>
                    <div className='dashboard-subheader'>Overview</div>
                    <ul role='list' className='dashboard-sub-ul'>
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
