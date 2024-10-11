import React, { ReactNode} from "react";
import MyGetServerSession from "@/lib/myGetServerSession";
import {notFound} from "next/navigation";
import Link from "next/link";
import {Icons, Icon} from "@/components/Icons";
import NavbarListItem, {navbarListItemProps} from "@/app/(dashboard)/navbarlistitem";
import layoutClassNames from "@/app/(dashboard)/layoutClassNames";

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
    return <div className={layoutClassNames.div.className}>
        <div className={layoutClassNames.div.div[0].className}>
        <Link href="/dashboard" className={layoutClassNames.div.Link.className}>
           <Icons.Logo className={layoutClassNames.div.Link.Icon.className}/>
        </Link>
        <div className={layoutClassNames.div.div[1].className}>
            Your Chats
        </div>
            <nav className={layoutClassNames.div.div[1].nav.className}>
                <ul role='list' className={layoutClassNames.div.div[1].nav.ul.className}>
                    <li>
                      //chats the user has
                    </li>
                    <div>Overview</div>
                    <ul role='list' className={layoutClassNames.div.div[1].nav.ul.ul.className}>
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
