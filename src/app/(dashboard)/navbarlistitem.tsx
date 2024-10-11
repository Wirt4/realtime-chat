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
        <Link href={props.href}
        className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold'
        >
            <span className='text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'>
                <Icon className='h-4 w-4' aria-label={props.Icon as string}/>
            </span>
        </Link>
        <span  className='truncate'>{props.name}</span>
    </li>
}

export default NavbarListItem
