'use client'
import {FC} from "react";
import Link from "next/link";
import {Icon, Icons} from "@/components/Icons";

export interface navbarListItemProps {
    href: string;
    Icon: Icon;
    name: string;
    id?: number
}

const NavbarListItem: FC<navbarListItemProps> =  (props) =>{
    const Icon = Icons[props.Icon]
    return <li>
        <Link href={props.href} className='link group'>
            <span className='link-icon group-hover:border-indigo-600 group-hover:text-indigo-600'>
                <Icon className='icon' aria-label={props.Icon as string}/>
            </span>
        <span className='truncate'>{props.name}</span>
        </Link>
    </li>
}

export default NavbarListItem;
